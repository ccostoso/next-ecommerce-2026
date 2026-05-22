"use client";

import { Menu } from "lucide-react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import Link from "next/link";
import { categories } from "./categories";

export default function MobileNav() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full">
                <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 p-4">
                    <SheetClose asChild>
                        <Link href="/">
                            <h3 className="text-sm font-semibold hover:text-foreground transition-colors">
                                Home
                            </h3>
                        </Link>
                    </SheetClose>
                    <SheetClose asChild>
                        <Link href="/products">
                            <h3 className="text-sm font-semibold hover:text-foreground transition-colors">
                                Products
                            </h3>
                        </Link>
                    </SheetClose>

                    <h3 className="text-sm font-semibold">Categories</h3>
                    <ul className="flex flex-col gap-2 pl-4">
                        {categories.map((category) => (
                            <li key={category.id}>
                                <SheetClose asChild>
                                    <Link
                                        href={`/products?category=${category.id}`}
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {category.name}
                                    </Link>
                                </SheetClose>
                            </li>
                        ))}
                    </ul>
                </nav>
            </SheetContent>
        </Sheet>
    );
}
