import { prisma } from "@/lib/prisma-server"
import { notFound } from "next/navigation"
import OrderItem from "./OrderItem"
import OrderSummary from "./OrderSummary"
import { auth } from "@/lib/auth"
import Breadcrumbs from "@/components/Breadcrumbs"

type OrderPageProps = {
    params: Promise<{
        orderId: string
    }>
}

export default async function OrderPage({ params }: OrderPageProps) {
    const { orderId } = await params

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    })

    if (!order) {
        notFound()
    }

    const session = await auth()
    const isOwner = session?.user?.id === order.userId

    return (
        <main className="container mx-auto px-4 py-8">
            {isOwner && (
                <Breadcrumbs
                    items={[
                        { label: "Account", href: "/account" },
                        {
                            label: `Order`,
                            href: `/order/${order.id}`,
                            active: true,
                        },
                    ]}
                />
            )}
            <ul>
                {order?.orderItems.map((item) => (
                    <OrderItem key={item.id} orderItem={item} />
                ))}
            </ul>
            <OrderSummary order={order} />
        </main>
    )
}
