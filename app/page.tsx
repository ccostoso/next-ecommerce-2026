import { ProductCard } from "./_components/ProductCard";
import { prisma } from "@/lib/prisma";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function HomePage(props: { searchParams: SearchParams }) {
    const searchParams = await props.searchParams;

    const page = Number(searchParams.page) || 1;
    const pageSize = 3;
    const skip = (page - 1) * pageSize;

    const products = await prisma.product.findMany({
        skip,
        take: pageSize,
    });

    await new Promise((resolve) => setTimeout(resolve, 1500));

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Home</h1>
            <p>Showing {products.length} products</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
