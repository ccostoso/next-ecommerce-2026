import { formatPrice } from "@/lib/utils"
import Image from "next/image"
import { OrderItemWithProduct } from "@/lib/types"

type OrderItemProps = {
    orderItem: OrderItemWithProduct
}

export default function OrderItem({ orderItem }: OrderItemProps) {
    return (
        <div className="border-b border-muted last:border-b-0 flex py-4 justify-between">
            {/* Left side: Product image and name with remove button */}
            <div className="flex space-x-4">
                {/* Product image and name */}
                <div className="overflow-hidden rounded-md border border-muted w-20 h-20">
                    {orderItem.product.image && (
                        <Image
                            className="h-full w-full object-cover"
                            src={orderItem.product.image}
                            alt={orderItem.product.name}
                            width={100}
                            height={100}
                        />
                    )}
                </div>
                <div className="flex flex-col">
                    <h2 className="font-medium">{orderItem.product.name}</h2>
                </div>
            </div>

            {/* Right side: Price and quantity controls */}
            <div className="flex flex-col justify-between items-end gap-2">
                <p className="font-medium">
                    Price: {formatPrice(orderItem.product.price)}
                </p>
                <div className="flex items-center border border-muted rounded-full">
                    <div className="px-3 py-1.5 text-center">
                        Quantity: {orderItem.quantity}
                    </div>
                </div>
            </div>
        </div>
    )
}
