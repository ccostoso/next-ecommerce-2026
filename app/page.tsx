import { ProductCard } from "./ProductCard";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
    const products = await prisma.product.findMany({
        include: {
            category: true,
        },
    });
    console.log(products);

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
