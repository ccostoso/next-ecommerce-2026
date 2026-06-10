import Breadcrumbs from "@/components/Breadcrumbs"
import { Suspense } from "react"
import ProductsSkeleton from "../../../components/skeletons/ProductsSkeleton"
import { notFound } from "next/navigation"
import ProductListData from "@/components/ProductListData"
import { getCategoryFromSlug } from "@/lib/actions/category-actions"

type CategoryPageProps = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ sort?: string }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
    const { slug } = await params
    const category = await getCategoryFromSlug(slug)

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
    const { sort } = await searchParams

    const category = await getCategoryFromSlug(slug, {
        name: true,
        slug: true,
    })

    if (!category) notFound()

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
                <ProductListData params={{ slug, sort }} />
            </Suspense>
        </>
    )
}
