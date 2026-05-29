"use client";

import { Button } from "@/components/ui/button";
import { Product } from "@/generated/prisma/client";
import { addToCart } from "@/lib/actions";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

type AddToCartButtonProps = {
    product: Product;
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);

        try {
            await addToCart(product.id, 1);
        } catch (error) {
            console.error("Error adding product to cart:", error);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <Button
            disabled={!product.inventory || isAdding}
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
        >
            <ShoppingCart className="mr-2" size={16} />
            {product.inventory > 0 ? "Add to cart" : "Out of stock"}
        </Button>
    );
}
