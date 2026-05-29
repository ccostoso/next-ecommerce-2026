"use server";

import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { Prisma } from "@/generated/prisma/client";
import { unstable_cache, updateTag } from "next/cache";

// Utility function to ensure that a value is a positive integer, otherwise return a fallback value.
function toPositiveInt(value: number | undefined, fallback: number) {
    return typeof value === "number" && Number.isInteger(value) && value > 0
        ? value
        : fallback;
}

export async function getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
        where: { slug },
        include: { category: true },
    });

    if (!product) return null;

    return product;
}

export type getProductsParams = {
    query?: string;
    slug?: string;
    sort?: string;
    page?: number;
    pageSize?: number;
};

export async function getProducts({ query, slug, sort, page = 1, pageSize = 3 }: getProductsParams) {
    let orderBy: Prisma.ProductOrderByWithRelationInput | undefined;

    switch (sort) {
        case "price_asc":
            orderBy = { price: "asc" };
            break;
        case "price_desc":
            orderBy = { price: "desc" };
            break;
        default:
            orderBy = undefined;
    }

    const where: Prisma.ProductWhereInput = {};

    if (query) {
        where.OR = [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
        ];
    }

    if (slug) {
        where.category = {
            slug,
        };
    }

    // Ensure that `page` and `pageSize` are positive integers, otherwise use default values.
    const safePage = toPositiveInt(page, 1);
    const safePageSize = toPositiveInt(pageSize, 3);

    // `skip` determines how many records to skip before starting to return results.
    // For example, if `page` is 2 and `pageSize` is 3, we want to skip the first 3 records (page 1) and 
    // return the next 3 records (page 2). 
    const skip = (safePage - 1) * safePageSize;

    // `take` determines how many records to return.
    const take = safePageSize;

    const products = await prisma.product.findMany({
        where,
        ...(orderBy ? { orderBy } : {}),
        skip,
        take,
    });

    return products;
}

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

export type CheckoutCart = ProductCart & {
    size: number;
    subtotal: number;
};

// This function retrieves the cart associated with the cart ID stored in the cookies.
// It uses `unstable_cache` to cache the result of fetching the cart from the database based on the cart ID,
// which can improve performance by avoiding redundant database queries for the same cart ID.
async function getCartFromCookies(): Promise<ProductCart | null> {
    const id = (await (cookies())).get("cartId")?.value;

    if (!id) return null;

    // Use `unstable_cache` to cache the result of fetching the cart from the database based on the cart ID. 
    // The cache key is generated using the cart ID, and the cache is tagged with the same key for invalidation 
    // purposes.
    return unstable_cache(async (id: string) => {
        return await prisma.cart.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }, [`cart-${id}`], { tags: [`cart-${id}`] })(id);
}

// This function retrieves the existing cart from the cookie or creates a new one if it doesn't exist. 
// If a new cart is created, it sets a cookie with the cart's ID for future reference. 
// The function returns the cart, including its items and associated products.
export async function getOrCreateProductCart(): Promise<ProductCart> {
    let cart = await getCartFromCookies();

    if (cart) return cart;

    cart = await prisma.cart.create({
        // The `data` property is required when creating a new record with Prisma, even if there are no fields to set.
        data: {},

        // The `include` property specifies related records to fetch along with the main record. 
        // In this case, it includes the items in the cart and their associated products.
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });

    // Set a cookie named "cartId" with the value of the newly created cart's ID.
    (await cookies()).set({
        name: "cartId",
        value: cart.id,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return cart;
}

// This function retrieves the current cart from the cookie and calculates additional properties 
// such as the total quantity of items (size) and the subtotal price of the cart. If no cart is found, 
// it returns null. The returned object includes all properties of the cart along with the calculated 
// size and subtotal.
export async function getCheckoutCart(): Promise<CheckoutCart | null> {
    const cart = await getCartFromCookies();

    if (!cart) return null;

    // Calculate the total quantity of items in the cart by summing the quantity of each item.
    const size = cart.items.reduce((total, item) => total + item.quantity, 0);

    // Calculate the subtotal by summing the product of quantity and price for each item in the cart.
    const subtotal = cart.items.reduce((total, item) => total + item.quantity * item.product.price, 0);

    return {
        ...cart,
        size,
        subtotal,
    };
}

export async function addToCart(productId: string, quantity: number = 1) {
    if (quantity < 1) throw new Error("Quantity must be at least 1");

    const cart = await getOrCreateProductCart();

    const existingItem = cart.items.find((item) => item.productId === productId);

    if (existingItem) {
        await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity },
        });
    } else {
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                quantity,
            },
        });
    }

    // Revalidate pages
    updateTag(`cart-${cart.id}`);
}