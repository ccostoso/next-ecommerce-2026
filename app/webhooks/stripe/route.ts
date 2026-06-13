import { prisma } from "@/lib/prisma-server"
import { stripe } from "@/lib/stripe"
import { NextRequest, NextResponse } from "next/server"
import { Stripe } from "stripe"

export async function POST(request: NextRequest) {
    const payload = await request.text()
    const signature = request.headers.get("Stripe-Signature")

    if (!signature) {
        return new NextResponse("Missing Stripe signature", { status: 400 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

    try {
        const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)

        switch (event.type) {
            case "checkout.session.expired": {
                const session = event.data.object

                const order = await prisma.order.findUnique({
                    where: { stripeSessionId: session.id },
                    include: { orderItems: true },
                })

                // No matching order (e.g. CLI-triggered fixture event) → no-op
                if (!order) break

                const result = await prisma.$transaction(async (tx) => {
                    const updated = await tx.order.updateMany({
                        where: { id: order.id, status: "pending_payment" },
                        data: { status: "cancelled" },
                    })
                    if (updated.count === 0) return { restored: false }  // someone else already handled it

                    await Promise.all(
                        order.orderItems.map((item) =>
                            tx.product.update({
                                where: { id: item.productId },
                                data: { inventory: { increment: item.quantity } },
                            })
                        )
                    )
                    return { restored: true }
                })

                if (result.restored) {
                    console.log(`Order ${order.id} cancelled and inventory restored for expired session ${session.id}`)
                } else {
                    console.log(`Order ${order.id} already processed (not pending) for expired session ${session.id}`)
                }

                break
            }
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session
                const orderId = session.metadata?.orderId

                if (!orderId) {
                    console.warn("No orderId in session metadata:", session.id)
                    break // verified event we can't act on → fall through to 200
                }

                const result = await prisma.order.updateMany({
                    where: {
                        id: orderId,
                        status: { in: ["pending_payment", "payment_processed"] },
                    },
                    data: { status: "paid", stripePaymentIntentId: session.payment_intent as string },
                })

                if (result.count === 0) {
                    console.warn("No pending order for session — already processed or unknown:", session.id)
                }

                break
            }
            default:
                console.warn("Unhandled Stripe event type:", event.type)
        }

        return new NextResponse(null, { status: 200 })
    } catch (error) {
        console.error("Error processing Stripe webhook:", error)
        return new NextResponse("Webhook error: " + (error instanceof Error ? error.message : "Unknown error"), { status: 400 })
    }
}