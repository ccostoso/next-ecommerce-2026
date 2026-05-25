import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "../../components/ProductCard";
import { sleep } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import ProductsSkeleton from "../../components/skeletons/ProductsSkeleton";

type SearchPageProps = {
    searchParams: Promise<{
        q?: string;
    }>;
};

type ProductsProps = {
    query: string;
};

async function Products({ query }: ProductsProps) {
    const products = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
            ],
        },
        take: 18,
    });

    await sleep(1000);

    if (products.length === 0) {
        return (
            <p className="text-center text-muted-foreground">
                No results found.
            </p>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </>
    );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;

    const breadcrumbItems = [
        { label: "Products", href: "/" },
        {
            label: `${q ? `Results for "${q}"` : "No query"}`,
            href: `/search${q ? `?q=${q}` : ""}`,
        },
    ];

    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />
            <Suspense key={q} fallback={<ProductsSkeleton />}>
                <Products query={q || ""} />
            </Suspense>
        </>
    );
}
