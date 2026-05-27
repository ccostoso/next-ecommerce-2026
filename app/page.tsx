import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import ProductsSkeleton from "../components/skeletons/ProductsSkeleton";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductListData from "@/components/ProductListData";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
const PAGE_SIZE = 3;

export default async function HomePage(props: { searchParams: SearchParams }) {
    const searchParams = await props.searchParams;

    const page = Number(searchParams.page) || 1;
    const total = await prisma.product.count();

    // Calculate total pages based on total products and page size
    const totalPages = Math.ceil(total / PAGE_SIZE);

    return (
        <main className="container mx-auto p-4 flex-1">
            <Breadcrumbs items={[{ label: "Products", href: "/" }]} />
            <Suspense key={page} fallback={<ProductsSkeleton />}>
                <ProductListData params={{ page, pageSize: PAGE_SIZE }} />
            </Suspense>

            <Pagination className="mt-8">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href={`?page=${page - 1}`} />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNum = i + 1;
                        if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= page - 1 && pageNum <= page + 1)
                        ) {
                            return (
                                <PaginationItem key={pageNum}>
                                    <PaginationLink
                                        href={`?page=${pageNum}`}
                                        isActive={page === pageNum}
                                    >
                                        {pageNum}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        }
                        return null;
                    })}

                    <PaginationItem>
                        <PaginationNext href={`?page=${page + 1}`} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </main>
    );
}
