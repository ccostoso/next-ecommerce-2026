import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { notFound, redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('session_id')
    // sessionId is the Stripe session ID for /checkout/canceled?session_id={CHECKOUT_SESSION_ID}

    if (!sessionId) {
        notFound()
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId)
        const { orderId } = session.metadata ?? {}

        if (!orderId) {
            notFound()
        }

        const order = await prisma.order.findUnique({
            where: {
                id: orderId,
                stripeSessionId: sessionId,
            },
            include: { orderItems: true },
        })

        if (!order) notFound()

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
            console.log(`Order ${order.id} cancelled and inventory restored for session ${sessionId}`)
        } else {
            console.log(`Order ${order.id} already processed (not pending) for session ${sessionId}`)
        }
    } catch (error) {
        if (error instanceof Error && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_")) {
            throw error // notFound — not a real error
        }
        console.error("Error retrieving Stripe session or updating order:", error)
        throw error
    }

    return redirect("/")
}