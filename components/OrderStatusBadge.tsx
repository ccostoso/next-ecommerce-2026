import { AlertCircle, CheckCircle, Clock, CreditCard } from "lucide-react"
import { Badge } from "./ui/badge"

export default function OrderStatusBadge({ status }: { status: string }) {
    const getStatusDetails = (status: string) => {
        switch (status) {
            case "paid":
                return {
                    label: "Paid",
                    variant: "default" as const,
                    icon: <CheckCircle className="w-4 h-4" />,
                }
            case "pending":
                return {
                    label: "Pending",
                    variant: "secondary" as const,
                    icon: <Clock className="w-4 h-4" />,
                }
            case "pending_payment":
                return {
                    label: "Payment Pending",
                    variant: "outline" as const,
                    icon: <CreditCard className="w-4 h-4" />,
                }
            case "failed":
                return {
                    label: "Failed",
                    variant: "destructive" as const,
                    icon: <AlertCircle className="w-4 h-4" />,
                }
            case "payment_processed":
                return {
                    label: "Payment Processed",
                    variant: "outline" as const,
                    icon: <CreditCard className="w-4 h-4" />,
                }
            case "cancelled":
                return {
                    label: "Cancelled",
                    variant: "destructive" as const,
                    icon: <AlertCircle className="w-4 h-4" />,
                }
            default:
                return {
                    label: status,
                    variant: "secondary" as const,
                    icon: <Clock className="w-4 h-4" />,
                }
        }
    }

    const statusDetails = getStatusDetails(status)
    return (
        <Badge
            variant={statusDetails.variant}
            className="flex items-center gap-1"
        >
            {statusDetails.icon}
            {statusDetails.label}
        </Badge>
    )
}
