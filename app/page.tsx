import { Suspense } from "react"
import ProductsSkeleton from "../components/skeletons/ProductsSkeleton"
import Breadcrumbs from "@/components/Breadcrumbs"
import ProductListData from "@/components/ProductListData"
import { getCachedProductCount } from "@/lib/actions/product-actions"
import { ProductListPagination } from "@/components/ProductListPagination"

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>
const PAGE_SIZE = 3

export default async function HomePage(props: { searchParams: SearchParams }) {
    const searchParams = await props.searchParams

    const page = Number(searchParams.page) || 1
    const total = await getCachedProductCount()

    // Calculate total pages based on total products and page size
    const totalPages = Math.ceil(total / PAGE_SIZE)

    return (
        <main className="container mx-auto p-4 flex-1">
            <Breadcrumbs items={[{ label: "Products", href: "/" }]} />
            <Suspense key={page} fallback={<ProductsSkeleton />}>
                <ProductListData params={{ page, pageSize: PAGE_SIZE }} />
            </Suspense>

            <ProductListPagination page={page} totalPages={totalPages} />
        </main>
    )
}
