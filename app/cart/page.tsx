import CartEntry from "@/components/CartEntry";
import { getCheckoutCart } from "@/lib/actions";
import { formatPrice } from "@/lib/utils";

export default async function CartPage() {
    const cart = await getCheckoutCart();

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
                    {cart?.items.map((item) => (
                        <CartEntry key={item.id} cartItem={item} />
                    ))}
                </div>
            )}
        </main>
    );
}
