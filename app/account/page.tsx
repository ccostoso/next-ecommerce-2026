import Breadcrumbs from "@/components/Breadcrumbs"
import OrderStatusBadge from "@/components/OrderStatusBadge"
import {
    Table,
    TableCell,
    TableBody,
    TableHeader,
    TableRow,
    TableHead,
} from "@/components/ui/table"
import { getOrdersByUserId } from "@/lib/actions/order-actions"
import { auth } from "@/lib/auth"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function AccountPage() {
    const session = await auth()
    if (!session?.user) {
        redirect("/auth/signin")
    }

    const orders = await getOrdersByUserId(session.user.id)

    return (
        <main className="container mx-auto p-4">
            <Breadcrumbs
                items={[{ label: "Account", href: "/account", active: true }]}
            />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No orders found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map((order) => (
                            <TableRow key={order.id}>
                                {/* Only show first four and last eight digits of order ID */}
                                <TableCell>
                                    {`${order.id.slice(0, 4)}...${order.id.slice(-8)}`}
                                </TableCell>
                                <TableCell>
                                    {new Date(
                                        order.createdAt,
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {formatPrice(order.total)}
                                </TableCell>
                                <TableCell>
                                    <OrderStatusBadge status={order.status} />
                                </TableCell>
                                <TableCell>
                                    <Link
                                        className="underline"
                                        href={`/order/${order.id}`}
                                    >
                                        View Details
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </main>
    )
}
