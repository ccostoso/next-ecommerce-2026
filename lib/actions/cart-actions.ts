"use server";

import { cookies } from "next/headers";
import { prisma } from "./../prisma";
import { unstable_cache, updateTag } from "next/cache";
import { CheckoutCart, ProductCart } from "./../types";

async function getProductCartFromCookies(): Promise<ProductCart | null> {
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
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
    }, [`cart-${id}`], { tags: [`cart-${id}`] })(id);
}

export async function getOrCreateProductCart(): Promise<ProductCart> {
    let cart = await getProductCartFromCookies();

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

export async function getCheckoutCart(): Promise<CheckoutCart | null> {
    const cart = await getProductCartFromCookies();

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

export async function setCartItemQuantity(productId: string, quantity: number) {
    if (quantity < 0) throw new Error("Quantity cannot be negative");

    const cart = await getProductCartFromCookies();

    if (!cart) throw new Error("Cart not found");

    const cartItem = cart.items.find((item) => item.productId === productId);

    if (!cartItem) throw new Error("Product not found in cart");

    try {
        if (quantity === 0) {

            await prisma.cartItem.delete({
                where: { id: cartItem.id },
            });
        } else {
            await prisma.cartItem.update({
                where: { id: cartItem.id },
                data: { quantity },
            });
        }

        // Revalidate pages
        updateTag(`cart-${cart.id}`);
    } catch (error) {
        console.error("Error updating cart item quantity:", error);
        throw new Error("Failed to update cart item quantity");
    }
}