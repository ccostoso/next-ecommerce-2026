import { prisma } from "@/lib/prisma-server";
import { notFound } from "next/navigation";
import OrderItem from "./OrderItem";
import OrderSummary from "./OrderSummary";

type OrderPageProps = {
    params: Promise<{
        orderId: string;
    }>;
};

export default async function OrderPage({ params }: OrderPageProps) {
    const { orderId } = await params;

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    });

    if (!order) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <ul>
                {order?.orderItems.map((item) => (
                    <OrderItem key={item.id} orderItem={item} />
                ))}
            </ul>
            <OrderSummary order={order} />
        </div>
    );
}
