import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { notFound, redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');
    // sessionId is the Stripe session ID for /checkout/canceled?session_id={CHECKOUT_SESSION_ID}

    if (!sessionId) {
        notFound();
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const { orderId } = session.metadata ?? {};

        if (!orderId) {
            notFound();
        }

        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                stripeSessionId: sessionId,
            },
        });

        if (!order) {
            notFound();
        }

        if (order.status === "pending_payment") {
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    status: "pending",
                    stripeSessionId: null,
                },
            });
        }

        return redirect("/");
    } catch (error) {
        console.error("Error retrieving Stripe session or updating order:", error);
        notFound();
    }
}