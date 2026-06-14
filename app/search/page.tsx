import Breadcrumbs from "@/components/Breadcrumbs"
import { Suspense } from "react"
import ProductsSkeleton from "../../components/skeletons/ProductsSkeleton"
import ProductListData from "@/components/ProductListData"
import { ProductListPagination } from "@/components/ProductListPagination"
import { getProductListCount } from "@/lib/actions/product-actions"

type SearchPageProps = {
    searchParams: Promise<{
        q?: string
        sort?: string
        page?: string
    }>
}

const PAGE_SIZE = 3

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q, sort, page } = await searchParams
    const currentPage = Number(page) || 1

    const total = await getProductListCount({ query: q || undefined })
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    const breadcrumbItems = [
        { label: "Products", href: "/" },
        {
            label: `${q ? `Results for "${q}"` : "No query"}`,
            href: `/search${q ? `?q=${q}` : ""}${sort ? `&sort=${sort}` : ""}`,
        },
    ]

    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />
            <Suspense fallback={<ProductsSkeleton />}>
                <ProductListData
                    params={{
                        query: q || "",
                        sort: sort || undefined,
                        page: currentPage,
                        pageSize: PAGE_SIZE,
                    }}
                />
            </Suspense>
            <ProductListPagination
                page={currentPage}
                totalPages={totalPages}
                basePath="/search"
                query={{ q: q || undefined, sort: sort || undefined }}
            />
        </>
    )
}
