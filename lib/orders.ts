"use server";

import { cookies } from "next/dist/server/request/cookies";
import { getCheckoutCart } from "./actions/cart-actions";
import { prisma } from "./prisma";
import { Prisma } from "@/generated/prisma/client";
import { createCheckoutSession } from "./stripe";

export async function processCheckout() {
    const cart = await getCheckoutCart();

    if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
    }

    try {
        const order = await prisma.$transaction(async (tx) => {
            const total = cart.subtotal;

            // Create a new order in the database
            const newOrder = await tx.order.create({
                data: { total }
            });

            // Map cart items to order items
            const orderItems: Prisma.OrderItemCreateManyInput[] = cart.items.map((item) => ({
                orderId: newOrder.id,
                productId: item.product.id,
                quantity: item.quantity,
                price: item.product.price,
            }));

            // Create order items in the database
            await tx.orderItem.createMany({
                data: orderItems,
            });

            // Clear the cart
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            });

            // Delete the cart itself
            await tx.cart.delete({
                where: { id: cart.id },
            });

            return newOrder;
        });

        // 1. Reload full order

        const createdOrder = await prisma.order.findUnique({
            where: { id: order.id },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // 2. Confirm that the order was created successfully
        if (!createdOrder) {
            throw new Error("Order not found");
        }

        // 3. Create the Stripe session
        const { sessionId, sessionUrl } = await createCheckoutSession(createdOrder);

        // 4. Return the session URL and handle errors
        if (!sessionId || !sessionUrl) {
            throw new Error("Failed to create Stripe checkout session");
        }

        // 5. Store the session ID in the order and change the order status
        await prisma.order.update({
            where: { id: createdOrder.id },
            data: {
                stripeSessionId: sessionId,
                status: "pending",
            },
        });

        (await cookies()).delete("cartId");

        return createdOrder;
    } catch (error) {
        console.error("Error creating order:", error);
        throw new Error("Failed to create order");
    }

    /*
    TODO:
    1. Calculate total price
    2. Create order in the database
    3. Create order items in the database
    4. Clear the cart
    5. Revalidate cache
    6. Return order details

    */
}