import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { notFound, redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('session_id')
    // sessionId is the Stripe session ID for /checkout/success?session_id={CHECKOUT_SESSION_ID}

    if (!sessionId) {
        notFound()
    }

    let orderId: string | null = null

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId)
        orderId = session.metadata?.orderId ?? null

        if (!orderId) {
            notFound()
        }

        const order = await prisma.order.findUnique({
            where: {
                id: orderId,
                stripeSessionId: sessionId,
            },
        })

        if (!order) notFound()

        if (order.status === "pending_payment") {
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    status: "payment_processed",
                },
            })
        }
    } catch (error) {
        if (error instanceof Error && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_")) {
            throw error // notFound — not a real error
        }
        console.error("Error retrieving Stripe session or updating order:", error)
        throw error
    }

    return orderId ? redirect(`/order/${orderId}`) : notFound()
}