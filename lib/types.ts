import { Prisma } from "@/generated/prisma/client";

export type ProductCart = Prisma.CartGetPayload<{
    include: {
        items: {
            include: {
                product: true;
            };
        };
    };
}>;

export type CheckoutCart = ProductCart & {
    size: number;
    subtotal: number;
};

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
    include: {
        product: true;
    };
}>;

export type OrderWithItemsAndProduct = Prisma.OrderGetPayload<{
    include: {
        orderItems: {
            include: {
                product: true;
            };
        };
    };
}>;

// Unused for now, but could be useful for future features like order confirmation page or order history
export type ProcessCheckoutResult = {
    sessionUrl: string;
    order: OrderWithItemsAndProduct;
};