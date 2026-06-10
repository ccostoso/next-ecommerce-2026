
"use server"

import { prisma } from "../prisma"
import { Prisma } from "@/generated/prisma/client"
import { toPositiveInt } from "./../utils"

export async function getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
        where: { slug },
        include: { category: true },
    })

    if (!product) return null

    return product
}

export async function getAllProducts(select?: Prisma.ProductSelect) {
    return prisma.product.findMany({ select })
}

export async function getProductCount() {
    return prisma.product.count()
}

export type getProductListDataParams = {
    query?: string
    slug?: string
    sort?: string
    page?: number
    pageSize?: number
}

export async function getProductListData({ query, slug, sort, page = 1, pageSize = 3 }: getProductListDataParams) {
    let orderBy: Prisma.ProductOrderByWithRelationInput | undefined

    switch (sort) {
        case "price_asc":
            orderBy = { price: "asc" }
            break
        case "price_desc":
            orderBy = { price: "desc" }
            break
        default:
            orderBy = undefined
    }

    const where: Prisma.ProductWhereInput = {}

    if (query) {
        where.OR = [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
        ]
    }

    if (slug) {
        where.category = {
            slug,
        }
    }

    // Ensure that `page` and `pageSize` are positive integers, otherwise use default values.
    const safePage = toPositiveInt(page, 1)
    const safePageSize = toPositiveInt(pageSize, 3)

    // `skip` determines how many records to skip before starting to return results.
    // For example, if `page` is 2 and `pageSize` is 3, we want to skip the first 3 records (page 1) and 
    // return the next 3 records (page 2). 
    const skip = (safePage - 1) * safePageSize

    // `take` determines how many records to return.
    const take = safePageSize

    const products = await prisma.product.findMany({
        where,
        ...(orderBy ? { orderBy } : {}),
        skip,
        take,
    })

    return products
}