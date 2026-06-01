import { getCheckoutCart } from "@/lib/actions";
import { formatPrice } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";

export default async function CartSummary() {
    const cartItems = await getCheckoutCart();

    if (!cartItems || cartItems.items.length === 0) return null;

    const subtotal = cartItems?.items.reduce((total, item) => {
        return total + item.product.price * item.quantity;
    }, 0);

    const taxes = 0; // Assuming a fixed tax rate of 10%
    const shipping = 0; // Flat shipping rate
    const totalPrice = subtotal + taxes + shipping;

    return (
        <div className="flex flex-col p-4 mt-4 border rounded-md">
            <div className="text-sm text-muted-foreground">
                <div className="flex items-center justify-between border-b pb-1 mb-3">
                    <p>Subtotal</p>
                    <p className="text-base text-foreground">
                        {formatPrice(subtotal)}
                    </p>
                </div>

                <div className="flex items-center justify-between border-b pb-1 mb-3">
                    <p>Taxes</p>
                    <p>Calculated at checkout</p>
                </div>

                <div className="flex items-center justify-between border-b pb-1 mb-3">
                    <p>Shipping</p>
                    <p>Calculated at checkout</p>
                </div>

                <div className="flex items-center justify-between border-b pb-1 mb-3  font-semibold">
                    <p className="text-foreground">Total</p>
                    <p className="text-base text-foreground">
                        {formatPrice(totalPrice)}
                    </p>
                </div>
            </div>

            <Button size="lg" className="mt-4 w-full" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
        </div>
    );
}
