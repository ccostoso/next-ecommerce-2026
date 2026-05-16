"use client";

import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Product } from "@/generated/prisma/client";
import { getProductBySlug } from "@/lib/actions";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
    product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/product/${product.slug}`} className="block">
            <Card
                className="pt-0 overflow-hidden"
                onClick={async () => {
                    getProductBySlug(product.slug);
                }}
            >
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
        </Link>
    );
}
