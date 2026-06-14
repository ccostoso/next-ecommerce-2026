
"use server"

import { prisma } from "../prisma"
import { Prisma } from "@/generated/prisma/client"
import { toPositiveInt } from "./../utils"
import { createProductsCacheKey, createProductsTags } from "../cache-keys"
import { unstable_cache } from "next/cache"

async function getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
        where: { slug },
        include: { category: true },
    })

    if (!product) return null

    return product
}

export async function getCachedProductBySlug(slug: string) {
    const cacheKey = `product:${slug}`
    const cacheTags = [`product:${slug}`]

    return unstable_cache(
        () => getProductBySlug(slug),
        [cacheKey],
        { tags: cacheTags, revalidate: 60 * 60 /* Revalidate every hour */ },
    )()
}

async function getAllProducts(select?: Prisma.ProductSelect) {
    return prisma.product.findMany({ select })
}

export async function getCachedAllProducts(select?: Prisma.ProductSelect) {
    const cacheKey = `products:all`
    const cacheTags = [`products`]

    return unstable_cache(
        () => getAllProducts(select),
        [cacheKey],
        { tags: cacheTags, revalidate: 60 * 60 /* Revalidate every hour */ },
    )()
}

export type getProductListDataParams = {
    query?: string
    slug?: string
    sort?: string
    page?: number
    pageSize?: number
}

// Pick<T, K> is a TypeScript utility type that constructs a new type by picking a set of properties 
// K from type T. In this case, we are defining a function that takes an object with only the "query" 
// and "slug" properties from getProductListDataParams.
function buildProductListWhere({ query, slug }: Pick<getProductListDataParams, "query" | "slug">): Prisma.ProductWhereInput {
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

    return where
}

async function getProductListData({ query, slug, sort, page = 1, pageSize = 3 }: getProductListDataParams) {
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

    const where = buildProductListWhere({ query, slug })

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

export async function getCachedProductListData({ query, slug, sort, page = 1, pageSize = 3 }: getProductListDataParams) {
    const cacheKey = createProductsCacheKey({ slug, query, page, limit: pageSize, sort })
    const cacheTags = createProductsTags({ slug, query })

    console.log("Cache key for product list:", cacheKey)
    console.log("Cache tags for product list:", cacheTags)

    return unstable_cache(
        () => getProductListData({ query, slug, sort, page, pageSize }),
        [cacheKey],
        { tags: cacheTags, revalidate: 60 * 60 /* Revalidate every hour */ },
    )()
}

type GetProductCountParams = Pick<getProductListDataParams, "query" | "slug">

async function getProductCount({ query, slug }: GetProductCountParams = {}) {
    const where = buildProductListWhere({ query, slug })
    return prisma.product.count({ where })
}

export async function getCachedProductCount({ query, slug }: GetProductCountParams = {}) {
    const keyParts = ["products-count"]

    if (query) keyParts.push(`query=${query}`)
    if (slug) keyParts.push(`category=${slug}`)

    const cacheKey = keyParts.join("&")
    const cacheTags = createProductsTags({ slug, query })

    return unstable_cache(
        () => getProductCount({ query, slug }),
        [cacheKey],
        { tags: cacheTags, revalidate: 60 * 60 /* Revalidate every hour */ },
    )()
}
