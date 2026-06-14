type ProductsCacheKey = {
    slug?: string
    query?: string
    page?: number
    limit?: number
    sort?: string
}

export function createProductsCacheKey({ query, slug, page, limit, sort }: ProductsCacheKey) {
    const keyParts = ["products"]

    if (slug) keyParts.push(`category=${slug}`)
    if (query) keyParts.push(`query=${query}`)
    if (page) keyParts.push(`page=${page}`)
    if (limit) keyParts.push(`limit=${limit}`)
    if (sort) keyParts.push(`sort=${sort}`)

    return keyParts.join("&")
}

type ProductsTagKey = {
    slug?: string
    query?: string
}

export function createProductsTags({ query, slug }: ProductsTagKey) {
    const tags = ["products"]

    if (slug) tags.push(`category=${slug}`)
    if (query) tags.push(`query=${query}`)

    return tags
}