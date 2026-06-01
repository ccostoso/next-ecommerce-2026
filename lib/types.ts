import { Prisma } from "@/generated/prisma/client";

export type CheckoutCart = ProductCart & {
    size: number;
    subtotal: number;
};

// Prisma.CartGetPayload is a utility type that generates the TypeScript 
// type for the result of a Prisma query on the Cart model, including 
// the specified relations and fields.
// Ensures that the ProductCart type includes the related items and 
// their associated products when fetching a cart from the database.
export type ProductCart = Prisma.CartGetPayload<{
    include: {
        items: {
            include: {
                product: true;
            };
        };
    };
}>;

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
    include: {
        product: true;
    };
}>;