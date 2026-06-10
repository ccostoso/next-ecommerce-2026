"use server"

import { cookies } from "next/headers"
import { getCheckoutCart } from "./actions/cart-actions"
import { updateTag } from "next/cache"
import { prisma } from "./prisma"
import { Prisma } from "@/generated/prisma/client"
import { createCheckoutSession } from "./stripe"
import { ProcessCheckoutResult } from "./types"
import { auth } from "./auth"

// This function handles the checkout process by creating an order, 
// generating a Stripe checkout session, and returning the session URL for redirection.
export async function processCheckout(): Promise<ProcessCheckoutResult> {
    // 1. Retrieve the current cart for the user
    const cart = await getCheckoutCart("db")
    const session = await auth()
    const userId = session?.user?.id

    if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty")
    }

    // 2. Create a new order in the database and associate it with the cart items
    let orderId: string | null = null

    try {
        // Use a transaction to ensure that all database operations succeed or fail together
        const order = await prisma.$transaction(async (tx) => {
            const total = cart.subtotal

            // Update inventory for each product in the cart. This uses an atomic update to
            // ensure that the inventory is only decremented if there is enough stock.
            for (const item of cart.items) {
                const result = await tx.product.updateMany({
                    where: {
                        id: item.product.id,
                        inventory: { gte: item.quantity }, // guard: enough stock
                    },
                    data: {
                        inventory: { decrement: item.quantity }, // atomic math
                    },
                })

                if (result.count === 0) {
                    throw new Error(`Insufficient stock for ${item.product.name}`)
                }
            }

            // Create a new order in the database
            const newOrder = await tx.order.create({
                data: {
                    total,
                    user: userId ? { connect: { id: userId } } : undefined,
                }
            })

            // Map cart items to order items
            const orderItems: Prisma.OrderItemCreateManyInput[] = cart.items.map((item) => ({
                orderId: newOrder.id,
                productId: item.product.id,
                quantity: item.quantity,
                price: item.product.price,
            }))

            // Create order items in the database
            await tx.orderItem.createMany({
                data: orderItems,
            })

            // Clear the cart
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            })

            // Delete the cart itself
            await tx.cart.delete({
                where: { id: cart.id },
            })

            return newOrder
        })

        // Invalidate cached cart reads for this cart id.
        updateTag(`cart-${cart.id}`)

        console.log("Order created successfully:", order)

        // Store the order ID for error handling in case of Stripe session creation failure
        orderId = order.id.toString()

        // Reload created order
        const createdOrder = await prisma.order.findUnique({
            where: { id: order.id },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        })

        // Confirm that the order was created successfully
        if (!createdOrder) {
            throw new Error("Order not found")
        }

        // Create the Stripe session
        const { sessionId, sessionUrl } = await createCheckoutSession(createdOrder)

        // Handle errors if session creation fails
        if (!sessionId || !sessionUrl) {
            throw new Error("Failed to create Stripe checkout session")
        }

        // Store the session ID in the order and change the order status
        await prisma.order.update({
            where: { id: createdOrder.id },
            data: {
                stripeSessionId: sessionId,
                status: "pending_payment",
            },
        });

        // Clear the cart cookie to prevent stale cart data
        (await cookies()).delete("cartId")

        // Return the session URL and the created order for potential future use (e.g., order confirmation page)
        return { sessionUrl, order: createdOrder }
    } catch (error) {
        // If an error occurs during the order creation or Stripe session creation, 
        // update the order status to "failed" if we have an order ID
        if (orderId && error instanceof Error && error.message.includes("Stripe")) {
            await prisma.order.update({
                where: { id: orderId },
                data: { status: "failed" },
            })
        }

        // Additionally, if the order was created but the Stripe session creation failed, 
        // we should attempt to restore inventory for the products in the order.
        if (orderId) {
            try {
                await prisma.$transaction([
                    prisma.order.update({
                        where: { id: orderId },
                        data: { status: "failed" },
                    }),
                    ...cart.items.map((item) =>
                        prisma.product.update({
                            where: { id: item.product.id },
                            data: { inventory: { increment: item.quantity } },
                        })
                    ),
                ])
            } catch (compensationError) {
                console.error(
                    `CRITICAL: compensation failed for order ${orderId} — inventory not restored`,
                    compensationError
                )
            }
        }

        console.error("Error creating order:", error)
        throw new Error("Failed to create order")
    }
}