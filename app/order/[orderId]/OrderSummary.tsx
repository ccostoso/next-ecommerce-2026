import OrderStatusBadge from "@/components/OrderStatusBadge";
import { OrderWithItemsAndProducts } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

type CartSummaryProps = {
    order: OrderWithItemsAndProducts;
};

export default async function CartSummary({ order }: CartSummaryProps) {
    return (
        <div className="flex flex-col p-4 mt-4 border rounded-md">
            <div className="text-sm text-muted-foreground">
                <div className="flex items-center justify-between border-b pb-1 mb-3">
                    <p>Subtotal</p>
                    <p className="text-base text-foreground">
                        {formatPrice(order.total)}
                    </p>
                </div>

                <div className="flex items-center justify-between border-b pb-1 mb-3">
                    <p>Taxes</p>
                    <p>{formatPrice(0)}</p>
                </div>

                <div className="flex items-center justify-between border-b pb-1 mb-3">
                    <p>Shipping</p>
                    <p>{formatPrice(0)}</p>
                </div>

                <div className="flex items-center justify-between border-b pb-1 mb-3">
                    <p>Status</p>
                    <OrderStatusBadge status={order.status} />
                </div>

                <div className="flex items-center justify-between border-b pb-1 mb-3  font-semibold">
                    <p className="text-foreground">Total</p>
                    <p className="text-base text-foreground">
                        {formatPrice(order.total)}
                    </p>
                </div>
            </div>
        </div>
    );
}
