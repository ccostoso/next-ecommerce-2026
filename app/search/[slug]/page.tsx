import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "../../_components/ProductCard";
import { sleep } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import ProductsSkeleton from "../../_components/skeletons/ProductsSkeleton";
import { notFound } from "next/navigation";
import Link from "next/link";
import CategorySidebar from "@/components/CategorySidebar";
import { Skeleton } from "@/components/ui/skeleton";
import CategorySidebarSkeleton from "@/app/_components/skeletons/CategorySidebarSkeleton";

type CategoryPageProps = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ sort?: string }>;
};

type ProductsProps = {
    slug: string;
    sort?: string;
};

async function Products({ slug, sort }: ProductsProps) {
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
            category: {
                slug: slug,
            },
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

export default async function CategoryPage({
    params,
    searchParams,
}: CategoryPageProps) {
    const { slug } = await params;
    const { sort } = await searchParams;

    const category = await prisma.category.findUnique({
        where: {
            slug,
        },
        select: {
            name: true,
            slug: true,
        },
    });

    if (!category) notFound();

    const breadcrumbItems = [
        { label: "Products", href: "/" },
        {
            label: category?.name,
            href: `/search/${category.slug}`,
        },
    ];

    return (
        <div className="container mx-auto p-4">
            <Breadcrumbs items={breadcrumbItems} />

            {/* <div className="flex gap-3 text-sm mb-8">
                <span>Sort by:</span>
                <Link
                    href={`/search/${slug}?sort=price_asc`}
                    className={`${
                        sort === "price_asc"
                            ? "font-semibold underline"
                            : "text-muted-foreground"
                    }`}
                >
                    Price (Low to High)
                </Link>
                <Link
                    href={`/search/${slug}?sort=price_desc`}
                    className={`${
                        sort === "price_desc"
                            ? "font-semibold underline"
                            : "text-muted-foreground"
                    }`}
                >
                    Price (High to Low)
                </Link>
            </div> */}
            <div className="flex gap-4">
                <div className="flex-none">
                    <Suspense fallback={<CategorySidebarSkeleton />}>
                        <CategorySidebar activeCategory={slug} />
                    </Suspense>
                </div>
                <div className="flex-1">
                    <Suspense
                        key={`${slug}-${sort}`}
                        fallback={<ProductsSkeleton />}
                    >
                        <Products slug={slug || ""} sort={sort || undefined} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
