"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";

type CategorySidebarProps = {
    categories?: {
        name: string;
        slug: string;
    }[];
};

export default function CategorySidebar({
    categories = [],
}: CategorySidebarProps) {
    // Get the slug property from the URL parameters and rename it to activeCategory
    const { slug: activeCategory } = useParams<{ slug?: string }>();

    return (
        <div className="w-full p-4 h-full">
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
