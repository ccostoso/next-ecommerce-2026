"use server"

import { Prisma } from "@/generated/prisma/browser"
import { prisma } from "../prisma"
import { unstable_cache } from "next/cache"

async function getCategoryBySlug(slug: string, select?: Prisma.CategorySelect) {
    return prisma.category.findUnique({
        where: { slug },
        select,
    })
}

export async function getCachedCategoryBySlug(slug: string, select?: Prisma.CategorySelect) {
    const cacheKey = `category-${slug}`
    const cacheTags = [`category=${slug}`]

    return unstable_cache(
        () => getCategoryBySlug(slug, select),
        [cacheKey],
        { tags: cacheTags, revalidate: 60 * 60 /* Revalidate every hour */ },
    )()
}

async function getCategorySidebarData() {
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

export async function getCachedCategorySidebarData() {
    const cacheKey = "category-sidebar-data"
    const cacheTags = ["categories"]

    return unstable_cache(
        () => getCategorySidebarData(),
        [cacheKey],
        { tags: cacheTags, revalidate: 60 * 60 /* Revalidate every hour */ },
    )()
}

export async function getAllCategories(select?: Prisma.CategorySelect) {
    return prisma.category.findMany({ select })
}
