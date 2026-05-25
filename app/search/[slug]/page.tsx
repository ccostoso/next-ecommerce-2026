import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "../../_components/ProductCard";
import { sleep } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import ProductsSkeleton from "../../_components/ProductsSkeleton";
import { notFound } from "next/navigation";

type CategoryPageProps = {
    params: Promise<{ slug: string }>;
};

type CategoriesProps = {
    slug: string;
};

async function Categories({ slug }: CategoriesProps) {
    const products = await prisma.product.findMany({
        where: {
            category: {
                slug: slug,
            },
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

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;

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
            <Suspense key={slug} fallback={<ProductsSkeleton />}>
                <Breadcrumbs items={breadcrumbItems} />
                <Categories slug={slug || ""} />
            </Suspense>
        </div>
    );
}
