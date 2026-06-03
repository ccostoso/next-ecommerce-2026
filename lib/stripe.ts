import Stripe from "stripe";
import { OrderWithItemsAndProduct } from "./types";

if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-05-27.dahlia",
    typescript: true,
});

export async function createCheckoutSession(order: OrderWithItemsAndProduct) {
    if (!order.orderItems || order.orderItems.length === 0) {
        throw new Error("Order has no items");
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.orderItems.map((item) => ({
        price_data: {
            currency: "usd",
            product_data: {
                name: item.product.name,
                description: item.product.description ?? "",
                images: [item.product.image ?? ""],
            },
            // Stripe expects integer cents, so round the floating-point dollar value first.
            unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
    }))

    const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/cart/?canceled=true`;

    try {
        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: "payment",
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: { orderId: order.id.toString() },
        });

        return { sessionId: session.id, sessionUrl: session.url };
    } catch (error) {
        console.error("Error creating Stripe checkout session:", error);
        throw new Error("Failed to create Stripe checkout session");
    }
}