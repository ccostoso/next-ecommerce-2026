"use server";

import { cookies } from "next/dist/server/request/cookies";
import { getCheckoutCart } from "./actions/cart-actions";
import { prisma } from "./prisma";
import { Prisma } from "@/generated/prisma/client";

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

        (await cookies()).delete("cartId");

        return order;
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