import { getAllCategories } from "@/lib/actions/category-actions"
import { getAllProducts } from "@/lib/actions/product-actions"

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const products = await getAllProducts({ slug: true })
    const categories = await getAllCategories({ slug: true })

    return [
        {
            url: `${baseUrl}/`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${baseUrl}/search`,
            lastModified: new Date().toISOString(),
        },
        ...products.map((product) => ({
            url: `${baseUrl}/product/${product.slug}`,
            lastModified: new Date().toISOString(),
        })),
        ...categories.map((category) => ({
            url: `${baseUrl}/search/${category.slug}`,
            lastModified: new Date().toISOString(),
        })),
    ]
}