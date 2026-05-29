import Link from "next/link";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { getCheckoutCart } from "@/lib/actions";
import { sleep } from "@/lib/utils";

export default async function CartIndicator() {
    const cart = await getCheckoutCart();
    const size = cart?.size || 0;

    await sleep(1000); // Simulate loading delay

    return (
        <Button variant="outline" className="relative" size="icon" asChild>
            <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {size > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 h-4 w-4 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {size}
                    </span>
                )}
            </Link>
        </Button>
    );
}
