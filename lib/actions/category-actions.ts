"use server"

import { Prisma } from "@/generated/prisma/browser"
import { prisma } from "../prisma"

export async function getCategoryBySlug(slug: string, select?: Prisma.CategorySelect) {
    return prisma.category.findUnique({
        where: { slug },
        select,
    })
}

export async function getCategorySidebarData() {
    return await prisma.category.findMany({
        select: {
            name: true,
            slug: true,
        },
        orderBy: {
            name: "asc",
        },
    })
}

export async function getAllCategories(select?: Prisma.CategorySelect) {
    return prisma.category.findMany({ select })
}
