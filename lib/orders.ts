"use server";

import { getCheckoutCart } from "./actions/cart-actions";

export async function createOrder() {
    const cart = await getCheckoutCart();

    if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
    }

    // Here you would typically create an order in your database and return the order details
    // For demonstration purposes, we'll just return a mock order object

    const order = {
        id: "order_123",
        total: cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
        items: cart.items,
    };

    return order;
}