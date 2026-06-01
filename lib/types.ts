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