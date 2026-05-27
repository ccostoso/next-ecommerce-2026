import { Product } from "@/generated/prisma/client";
import ProductCard from "./ProductCard";

type ProductsListProps = {
    products: Product[];
};

export default function ProductList({ products }: ProductsListProps) {
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
