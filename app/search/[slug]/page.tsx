import Breadcrumbs from "@/components/Breadcrumbs"
import { Suspense } from "react"
import ProductsSkeleton from "../../../components/skeletons/ProductsSkeleton"
import { notFound } from "next/navigation"
import ProductListData from "@/components/ProductListData"
import { getCategoryBySlug } from "@/lib/actions/category-actions"
import { ProductListPagination } from "@/components/ProductListPagination"
import { getProductListCount } from "@/lib/actions/product-actions"

type CategorySearchParams = {
    sort?: string
    page?: string
}

type CategoryPageProps = {
    params: Promise<{ slug: string }>
    searchParams: Promise<CategorySearchParams>
}

const PAGE_SIZE = 3

export async function generateMetadata({ params }: CategoryPageProps) {
    const { slug } = await params
    const category = await getCategoryBySlug(slug)

    if (!category) return {}

    return {
        title: `Next Commerce - ${category.name}`,
        openGraph: {
            title: `Next Commerce - ${category.name}`,
            description: `Browse products in the ${category.name} category on Next Commerce.`,
        },
    }
}

export default async function CategoryPage({
    params,
    searchParams,
}: CategoryPageProps) {
    const { slug } = await params
    const { sort, page } = await searchParams
    const currentPage = Number(page) || 1

    const category = await getCategoryBySlug(slug, {
        name: true,
        slug: true,
    })

    if (!category) notFound()

    const total = await getProductListCount({ slug })
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    const breadcrumbItems = [
        { label: "Products", href: "/" },
        {
            label: category?.name,
            href: `/search/${category.slug}`,
        },
    ]

    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />

            <Suspense key={`${slug}-${sort}`} fallback={<ProductsSkeleton />}>
                <ProductListData
                    params={{
                        slug,
                        sort,
                        page: currentPage,
                        pageSize: PAGE_SIZE,
                    }}
                />
            </Suspense>
            <ProductListPagination
                page={currentPage}
                totalPages={totalPages}
                basePath={`/search/${slug}`}
                query={{ sort: sort || undefined }}
            />
        </>
    )
}
