import { prisma } from "@/lib/prisma-server";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";

export async function POST(request: NextRequest) {
    const payload = await request.text();
    const signature = request.headers.get("Stripe-Signature");

    if (!signature) {
        return new NextResponse("Missing Stripe signature", { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    try {
        const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;
            const orderId = session.metadata?.orderId;

            if (!orderId) {
                console.warn("No orderId found in session metadata for session ID:", session.id);
                return new NextResponse("No orderId in session metadata", { status: 400 });
            }

            await prisma.order.update({
                where: { id: orderId },
                data: { status: "paid", stripePaymentIntentId: session.payment_intent as string },
            });
            console.log("Received checkout.session.completed event for session ID:", session.id);
        } else {
            console.warn("Unhandled Stripe event type:", event.type);
        }
        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error("Error processing Stripe webhook:", error);
        return new NextResponse("Webhook error: " + (error instanceof Error ? error.message : "Unknown error"), { status: 400 });
    }
}