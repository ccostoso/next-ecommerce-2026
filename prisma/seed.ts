import { Prisma, Product } from "@/generated/prisma/client";
import { prisma } from "../lib/prisma";
import { hashPassword } from "@/lib/auth";

async function main() {
    await prisma.orderItem.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    const electronics = await prisma.category.create({
        data: {
            name: "Electronics",
            slug: "electronics",
        },
    });

    const clothing = await prisma.category.create({
        data: {
            name: "Clothing",
            slug: "clothing",
        },
    });

    const home = await prisma.category.create({
        data: {
            name: "Home",
            slug: "home",
        },
    });

    const products = [
        {
            name: "Wireless Headphones",
            description:
                "Premium noise-cancelling wireless headphones with long battery life.",
            price: 199.99,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
            category: { connect: { id: electronics.id } },
            slug: "wireless-headphones",
            inventory: 10,
        },
        {
            name: "Smart Watch",
            description:
                "Fitness tracker with heart rate monitoring and sleep analysis.",
            price: 149.99,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
            category: { connect: { id: electronics.id } },
            slug: "smart-watch",
            inventory: 15,
        },
        {
            name: "Running Shoes",
            description: "Lightweight running shoes with responsive cushioning.",
            price: 89.99,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
            category: { connect: { id: clothing.id } },
            slug: "running-shoes",
            inventory: 20,
        },
        {
            name: "Ceramic Mug",
            description: "Handcrafted ceramic mug with minimalist design.",
            price: 24.99,
            image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d",
            category: { connect: { id: home.id } },
            slug: "ceramic-mug",
            inventory: 30,
        },
        {
            name: "Leather Backpack",
            description: "Durable leather backpack with multiple compartments.",
            price: 79.99,
            image: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7",
            category: { connect: { id: clothing.id } },
            slug: "leather-backpack",
            inventory: 12,
        },
    ] satisfies Prisma.ProductCreateInput[];

    for (const product of products) {
        await prisma.product.create({
            data: product,
        });
    }

    const users = [
        {
            name: "John User",
            email: "user@example.com",
            password: "password123",
            role: "user",
        },
        {
            name: "Jane Admin",
            email: "admin@example.com",
            password: "admin123",
            role: "admin",
        },
    ] satisfies Prisma.UserCreateInput[];

    for (const user of users) {
        await prisma.user.create({
            data: { ...user, password: await hashPassword(user.password) }
        });
    }

    console.log("Users created");
}

main()
    .then(async () => {
        console.log('Seeding complete!');
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
