import Link from "next/link";
import { Button } from "./ui/button";
import { Search, ShoppingCart } from "lucide-react";
import { ModeToggle } from "./ThemeToggle";

const categories = [
    { id: 1, name: "Electronics", href: "/products?category=electronics" },
    { id: 2, name: "Clothing", href: "/products?category=clothing" },
    { id: 3, name: "Home", href: "/products?category=home" },
];

export default function Navbar() {
    return (
        <div className="border-b">
            <div className="container mx-auto flex h-16 justify-between items-center">
                <div className="flex items-center gap-6">
                    <Link href="/" className="text-2xl font-bold">
                        NextCommerce
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={category.href}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/search">
                            <Search className="h-5 w-5" />
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/cart">
                            <ShoppingCart className="h-5 w-5" />
                        </Link>
                    </Button>
                    <ModeToggle />
                </div>
            </div>
        </div>
    );
}
