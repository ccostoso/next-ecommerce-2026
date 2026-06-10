"use client"

import { CartItemWithProduct } from "@/lib/types"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"
import { Button } from "./ui/button"
import { Minus, Plus, X } from "lucide-react"
import { useState } from "react"
import { setCartItemQuantity } from "@/lib/actions/cart-actions"
import { useCart } from "@/lib/use-cart"
import Link from "next/link"

type CartEntryProps = {
    cartItem: CartItemWithProduct
}

export default function CartEntry({ cartItem }: CartEntryProps) {
    const [isLoading, setIsLoading] = useState(false)
    const { revalidateCart } = useCart() // Get the revalidateCart function from the useCart hook

    const handleSetCartItemQuantity = async (delta: number) => {
        setIsLoading(true)
        try {
            await setCartItemQuantity(
                cartItem.product.id,
                cartItem.quantity + delta,
            )
            revalidateCart() // Revalidate the cart data after updating the item quantity
        } catch (error) {
            console.error("Failed to update cart item quantity:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="border-b border-muted last:border-b-0 flex py-4 justify-between">
            {/* Left side: Product image and name with remove button */}
            <div className="flex space-x-4">
                {/* Remove button in the top-left corner of the product image */}
                <div className="absolute z-10 -ml-1 -mt-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full bg-background/90 text-foreground border border-border shadow-sm backdrop-blur-sm hover:bg-muted"
                        onClick={() =>
                            handleSetCartItemQuantity(-cartItem.quantity)
                        }
                        disabled={isLoading}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Product image and name */}
                <div className="overflow-hidden rounded-md border border-muted w-20 h-20">
                    {cartItem.product.image && (
                        <Image
                            className="h-full w-full object-cover"
                            src={cartItem.product.image}
                            alt={cartItem.product.name}
                            width={100}
                            height={100}
                        />
                    )}
                </div>
                <div className="flex flex-col">
                    <h2 className="font-medium">
                        <Link
                            href={`/product/${cartItem.product.slug}`}
                            className="hover:underline"
                        >
                            {cartItem.product.name}
                        </Link>
                    </h2>
                </div>
            </div>

            {/* Right side: Price and quantity controls */}
            <div className="flex flex-col justify-between items-end gap-2">
                <p className="font-medium">
                    Price: {formatPrice(cartItem.product.price)}
                </p>
                <div className="flex items-center border border-muted rounded-full">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-l-full"
                        onClick={() => handleSetCartItemQuantity(-1)}
                        disabled={isLoading}
                    >
                        <Minus size={16} />
                    </Button>
                    <div className="w-6 text-center">{cartItem.quantity}</div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-r-full"
                        onClick={() => handleSetCartItemQuantity(1)}
                        disabled={isLoading}
                    >
                        <Plus size={16} />
                    </Button>
                </div>
            </div>
        </div>
    )
}
