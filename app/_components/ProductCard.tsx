import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Product } from "@/generated/prisma/client";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

type ProductCardProps = {
    product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Card className="pt-0 overflow-hidden">
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
            <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
            </CardHeader>

            <CardFooter>
                <p>{formatPrice(product.price)}</p>
            </CardFooter>
        </Card>
    );
}
