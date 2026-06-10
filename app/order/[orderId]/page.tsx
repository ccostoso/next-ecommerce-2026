import { notFound } from "next/navigation"
import OrderItem from "./OrderItem"
import OrderSummary from "./OrderSummary"
import { auth } from "@/lib/auth"
import Breadcrumbs from "@/components/Breadcrumbs"
import { getOrderById } from "@/lib/actions/order-actions"

type OrderPageProps = {
    params: Promise<{
        orderId: string
    }>
}

export default async function OrderPage({ params }: OrderPageProps) {
    const { orderId } = await params

    const order = await getOrderById(orderId)

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
