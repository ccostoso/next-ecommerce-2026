import Breadcrumbs from "@/components/Breadcrumbs";
import { Suspense } from "react";
import ProductsSkeleton from "../../components/skeletons/ProductsSkeleton";
import ProductListData from "@/components/ProductListData";

type SearchPageProps = {
    searchParams: Promise<{
        q?: string;
        sort?: string;
    }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q, sort } = await searchParams;

    const breadcrumbItems = [
        { label: "Products", href: "/" },
        {
            label: `${q ? `Results for "${q}"` : "No query"}`,
            href: `/search${q ? `?q=${q}` : ""}${sort ? `&sort=${sort}` : ""}`,
        },
    ];

    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />
            <Suspense key={`${q}-${sort}`} fallback={<ProductsSkeleton />}>
                <ProductListData
                    params={{ query: q || "", sort: sort || undefined }}
                />
            </Suspense>
        </>
    );
}
