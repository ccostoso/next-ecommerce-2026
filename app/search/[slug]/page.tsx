import Breadcrumbs from "@/components/Breadcrumbs";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import ProductsSkeleton from "../../../components/skeletons/ProductsSkeleton";
import { notFound } from "next/navigation";
import ProductListData from "@/components/ProductListData";

type CategoryPageProps = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ sort?: string }>;
};

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
        <>
            <Breadcrumbs items={breadcrumbItems} />

            <Suspense key={`${slug}-${sort}`} fallback={<ProductsSkeleton />}>
                <ProductListData params={{ slug, sort }} />
            </Suspense>
        </>
    );
}
