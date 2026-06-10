"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/use-cart"

function CartButton({ children }: { children: React.ReactNode }) {
    return (
        <Button variant="outline" className="relative" size="icon" asChild>
            <Link href="/cart">{children}</Link>
        </Button>
    )
}

export default function CartIndicator() {
    const { size, isLoading } = useCart()

    if (isLoading) {
        return (
            <CartButton>
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            </CartButton>
        )
    }

    return (
        <CartButton>
            <ShoppingCart className="h-5 w-5" />
            {size > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {size}
                </span>
            )}
        </CartButton>
    )
}
