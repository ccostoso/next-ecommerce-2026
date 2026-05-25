import { prisma } from "@/lib/prisma";
import { cn, sleep } from "@/lib/utils";
import Link from "next/link";

type CategorySidebarProps = {
    activeCategory?: string;
};

export default async function CategorySidebar({
    activeCategory,
}: CategorySidebarProps) {
    const categories = await prisma.category.findMany({
        select: {
            name: true,
            slug: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    await sleep(500);

    return (
        <div className="w-31.25 p-4 border rounded h-full">
            <h3 className="text-sm text-muted-foreground mb-2">Collections</h3>
            <div className="flex flex-col gap-2">
                <ul>
                    {categories.map((category) => (
                        <li key={category.slug}>
                            <Link
                                href={`/search/${category.slug}`}
                                className={cn(
                                    "text-sm",
                                    activeCategory === category.slug &&
                                        "underline underline-offset-4 font-medium",
                                    "hover:text-primary",
                                )}
                            >
                                {category.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
