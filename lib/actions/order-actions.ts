"use server"

import { prisma } from "./../prisma"
import { OrderWithItemsAndProducts } from "../types"

export async function getOrderById(orderId: string): Promise<OrderWithItemsAndProducts | null> {
    return await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    })
}

export async function getOrdersByUserId(userId: string): Promise<OrderWithItemsAndProducts[]> {
    return prisma.order.findMany({
        where: { userId },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    })
}
