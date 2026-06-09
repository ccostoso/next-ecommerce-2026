import CartEntry from "@/components/CartEntry"
import CartSummary from "@/components/CartSummary"
import { Button } from "@/components/ui/button"
import { getCheckoutCart } from "@/lib/actions/cart-actions"
import { processCheckout } from "@/lib/orders"
import { sleep } from "@/lib/utils"
import { redirect } from "next/navigation"

export default async function CartPage() {
    const cart = await getCheckoutCart()

    const handleCheckout = async () => {
        "use server"

        let sessionUrl: string

        try {
            ({ sessionUrl } = await processCheckout())
        } catch (error) {
            console.error("Checkout failed:", error)
            throw error
        }

        redirect(sessionUrl)
    }

    await sleep(1500)

    return (
        <main className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

            {!cart || cart?.items.length === 0 ? (
                <div className="text-center">
                    <p className="text-2xl">Your cart is currently empty.</p>
                    <p className="text-muted-foreground">
                        Add some products to your cart to get started.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col">
                    <div>
                        {cart?.items.map((item) => (
                            <CartEntry key={item.id} cartItem={item} />
                        ))}
                    </div>
                    <CartSummary />

                    <form action={handleCheckout}>
                        <Button size="lg" className="mt-4 w-full">
                            Proceed to checkout
                        </Button>
                    </form>
                </div>
            )}
        </main>
    )
}
