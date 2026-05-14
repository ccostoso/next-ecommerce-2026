import { Product } from "@/lib/mocks";
import Image from "next/image";

export function ProductCard({ product }: { product: Product }) {
    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="relative aspect-video">
                <Image
                    src={product.image}
                    alt={product.name}
                    className="object-cover"
                    fill
                />
            </div>
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
            <p className="text-gray-600 mb-4">{product.description}</p>
        </div>
    );
}
