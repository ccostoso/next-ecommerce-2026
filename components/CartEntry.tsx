import { CartItemWithProduct } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";

type CartEntryProps = {
    cartItem: CartItemWithProduct;
};

export default function CartEntry({ cartItem }: CartEntryProps) {
    return (
        <li className="border-b border-muted flex py-4 justify-between">
            <div className="flex space-x-4">
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
                    <h2 className="font-medium">{cartItem.product.name}</h2>
                </div>
            </div>

            <div className="flex flex-col justify-between items-end gap-2">
                <p className="font-medium">
                    Price: {formatPrice(cartItem.product.price)}
                </p>
                {/* <p className="font-medium">Quantity: {cartItem.quantity}</p> */}
                <div className="flex items-center border border-muted rounded-full">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-l-full"
                    >
                        <Minus size={16} />
                    </Button>
                    <div className="w-6 text-center">{cartItem.quantity}</div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-r-full"
                    >
                        <Plus size={16} />
                    </Button>
                </div>
            </div>
        </li>
    );
}
