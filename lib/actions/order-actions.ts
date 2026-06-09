"use server"

import { prisma } from "./../prisma"
import { OrderWithItemsAndProducts } from "../types"

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
