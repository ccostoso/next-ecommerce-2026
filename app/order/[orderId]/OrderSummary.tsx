import { Badge } from "@/components/ui/badge";
import { OrderWithItemsAndProducts } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

type CartSummaryProps = {
    order: OrderWithItemsAndProducts;
};

const statusStyles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-600",
    pending_payment: "bg-orange-100 text-orange-600",
    payment_processed: "bg-green-100 text-green-600",
    paid: "bg-green-400 text-green-900",
    canceled: "bg-red-100 text-red-600",
};

function StatusBadge({ status }: { status: string }) {
    const colorClasses = statusStyles[status] ?? "bg-gray-100 text-gray-500";
    return (
        <Badge className={`${colorClasses} px-2 py-1 rounded-full`}>
            {status.replace("_", " ").toUpperCase()}
        </Badge>
    );
}

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
                    <StatusBadge status={order.status} />
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
