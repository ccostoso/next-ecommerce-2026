import Link from "next/link";
import { Button } from "./ui/button";
import { Search, ShoppingCart } from "lucide-react";
import { ModeToggle } from "./ThemeToggle";
import MobileNav from "./MobileNav";
import { categories } from "../lib/categories";
import SearchInput from "./SearchInput";
import CartIndicator from "./CartIndicator";

export default function Navbar() {
    return (
        <div className="border-b border-dashed px-4">
            <div className="container mx-auto flex h-16 justify-between items-center xl:px-4">
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="text-2xl font-bold hidden md:block"
                    >
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

                    <MobileNav />
                </div>

                <div className="block w-full mx-4 md:mx-8">
                    <SearchInput />
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/search">
                            <Search className="h-5 w-5" />
                        </Link>
                    </Button>
                    <CartIndicator />
                    <ModeToggle />
                </div>
            </div>
        </div>
    );
}
