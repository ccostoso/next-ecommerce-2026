import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import ProductCard from "./_components/ProductCard";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import ProductsSkeleton from "./_components/ProductsSkeleton";
import { sleep } from "@/lib/utils";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
const PAGE_SIZE = 3;

type ProductsProps = {
    page: number;
};
async function Products({ page }: ProductsProps) {
    const skip = (page - 1) * PAGE_SIZE;
    const products = await prisma.product.findMany({
        skip,
        take: PAGE_SIZE,
    });

    await sleep(1500);

    return (
        <>
            {" "}
            <p>Showing {products.length} products</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </>
    );
}

export default async function HomePage(props: { searchParams: SearchParams }) {
    const searchParams = await props.searchParams;

    const page = Number(searchParams.page) || 1;
    const total = await prisma.product.count();
    const totalPages = Math.ceil(total / PAGE_SIZE);
    return (
        <main className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Home</h1>

            <Suspense key={page} fallback={<ProductsSkeleton />}>
                <Products page={page} />
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
