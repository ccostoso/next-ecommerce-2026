import Link from "next/link";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";

export default function CartIndicatorSkeleton() {
    return (
        <Button
            variant="outline"
            className="relative opacity-50"
            size="icon"
            asChild
        >
            <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
            </Link>
        </Button>
    );
}
