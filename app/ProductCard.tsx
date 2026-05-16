import { Product } from "@/generated/prisma/client";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

type ProductCardProps = {
    product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="relative aspect-video">
                {product.image && (
                    <Image
                        src={product.image}
                        alt={product.name}
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        fill
                    />
                )}
            </div>
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{formatPrice(product.price)}</p>
            <p className="text-gray-600 mb-4">{product.description}</p>
        </div>
    );
}
