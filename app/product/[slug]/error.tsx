"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

type ProductErrorProps = {
    error: Error
    reset: () => void
}

export default function ProductError({ error, reset }: ProductErrorProps) {
    return (
        <main className="container mx-auto p-4 flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-2xl font-bold mb-2">Error Loading Product</h1>
            <p className="text-center text-foreground mb-4">
                An error occurred while loading the product details. Please try
                again.
            </p>
            <Button onClick={() => reset()} variant={"outline"}>
                Try Again
            </Button>
            <Link
                href="/"
                className="text-sm text-muted-foreground hover:underline"
            >
                Return to home
            </Link>
        </main>
    )
}
