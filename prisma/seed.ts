import { Product } from "@/generated/prisma/client";
import { prisma } from "../lib/prisma";

async function main() {
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

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

    const products: Product[] = [
        {
            id: "1",
            name: "Wireless Headphones",
            description:
                "Premium noise-cancelling wireless headphones with long battery life.",
            price: 199.99,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
            categoryId: electronics.id,
            slug: "wireless-headphones",
            inventory: 10,
        },
        {
            id: "2",
            name: "Smart Watch",
            description:
                "Fitness tracker with heart rate monitoring and sleep analysis.",
            price: 149.99,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
            categoryId: electronics.id,
            slug: "smart-watch",
            inventory: 15,
        },
        {
            id: "3",
            name: "Running Shoes",
            description: "Lightweight running shoes with responsive cushioning.",
            price: 89.99,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
            categoryId: clothing.id,
            slug: "running-shoes",
            inventory: 20,
        },
        {
            id: "4",
            name: "Ceramic Mug",
            description: "Handcrafted ceramic mug with minimalist design.",
            price: 24.99,
            image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d",
            categoryId: home.id,
            slug: "ceramic-mug",
            inventory: 30,
        },
        {
            id: "5",
            name: "Leather Backpack",
            description: "Durable leather backpack with multiple compartments.",
            price: 79.99,
            image: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7",
            categoryId: clothing.id,
            slug: "leather-backpack",
            inventory: 12,
        },
    ];

    for (const product of products) {
        await prisma.product.create({
            data: product,
        });
    }
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
