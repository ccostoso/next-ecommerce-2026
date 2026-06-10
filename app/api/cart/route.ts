import { getCheckoutCart } from "@/lib/actions/cart-actions"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const cart = await getCheckoutCart()
        return NextResponse.json({ size: cart?.size || 0 })

    } catch (error) {
        console.error("Error fetching cart:", error)
        return NextResponse.json({ size: 0 }, { status: 500 })
    }
}