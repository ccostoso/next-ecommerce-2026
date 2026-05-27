import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "../../components/ProductCard";
import { sleep } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import ProductsSkeleton from "../../components/skeletons/ProductsSkeleton";

type SearchPageProps = {
    searchParams: Promise<{
        q?: string;
        sort?: string;
    }>;
};

type ProductsProps = {
    query: string;
    sort?: string;
};

async function Products({ query, sort }: ProductsProps) {
    let orderBy: Record<string, "asc" | "desc"> | undefined;

    switch (sort) {
        case "price_asc":
            orderBy = { price: "asc" };
            break;
        case "price_desc":
            orderBy = { price: "desc" };
            break;
        default:
            orderBy = undefined;
    }

    const products = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
            ],
        },
        ...(orderBy ? { orderBy } : {}),
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
                <Products query={q || ""} sort={sort || undefined} />
            </Suspense>
        </>
    );
}
