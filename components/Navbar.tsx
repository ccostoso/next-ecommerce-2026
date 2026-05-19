import Link from "next/link";

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
            </div>
        </div>
    );
}
