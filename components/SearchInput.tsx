"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import {
    useRouter,
    useSearchParams,
} from "next/dist/client/components/navigation";
import { useState } from "react";

export default function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";
    const [query, setQuery] = useState(initialQuery);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedQuery = query.trim();
        const params = new URLSearchParams();

        if (trimmedQuery) {
            params.set("q", trimmedQuery);
            router.push(`/search?${params.toString()}`);
        } else {
            router.push(`/search`);
        }
    };

    return (
        <form className="relative w-full" onSubmit={handleSearch}>
            <Search className="absolute w-4 h-4 left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search..."
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                key={searchParams.get("q") || ""}
            />
        </form>
    );
}
