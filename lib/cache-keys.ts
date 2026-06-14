type ProductsCacheKey = {
    categorySlug?: string
    query?: string
    page?: number
    limit?: number
    sort?: string
}

export function createProductsCacheKey({ categorySlug, query, page, limit, sort }: ProductsCacheKey) {
    const keyParts = ["products"]

    if (categorySlug) keyParts.push(`category=${categorySlug}`)
    if (query) keyParts.push(`query=${query}`)
    if (page) keyParts.push(`page=${page}`)
    if (limit) keyParts.push(`limit=${limit}`)
    if (sort) keyParts.push(`sort=${sort}`)

    return keyParts.join("&")
}

type ProductsTagKey = {
    categorySlug?: string
    query?: string
}

export function createProductsTags({ categorySlug, query }: ProductsTagKey) {
    const tags = ["products"]

    if (categorySlug) tags.push(`category=${categorySlug}`)
    if (query) tags.push(`query=${query}`)

    return tags
}