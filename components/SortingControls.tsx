"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ListFilter } from "lucide-react";

export default function SortingControls() {
    // Get the current search parameters from the URL
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort") || undefined;
    console.log("Current search parameters:", searchParams.toString());

    // Function to create a URL with the selected sort option
    const createSortURL = (sortOption: string | null) => {
        // Create a new URLSearchParams object based on the current search parameters
        const params = new URLSearchParams(searchParams.toString());

        // If a sort option is provided, set it in the search parameters; otherwise, remove the sort parameter
        if (sortOption) {
            params.set("sort", sortOption);
        } else {
            // If sortOption is null (for future unsorted option), remove the "sort" parameter from the URL
            params.delete("sort");
        }

        // Return the new URL with the updated search parameters
        const query = params.toString();
        return query ? `?${query}` : "";
    };

    return (
        <div className="w-full p-4 h-full flex flex-col">
            <h3 className="text-sm text-muted-foreground mb-2">
                <ListFilter className="inline-block mr-2" />
                Sort by
            </h3>
            <div className="flex gap-3 text-sm mb-8">
                <ul>
                    <li>
                        <Link
                            href={createSortURL(null)} // Pass null to indicate no sorting
                            className={cn({
                                "font-semibold underline": !currentSort,
                                "text-muted-foreground": !!currentSort,
                            })}
                        >
                            Relevance
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={createSortURL("price_asc")}
                            className={cn({
                                "font-semibold underline":
                                    currentSort === "price_asc",
                                "text-muted-foreground":
                                    currentSort !== "price_asc",
                            })}
                        >
                            Price (Low to High)
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={createSortURL("price_desc")}
                            className={cn({
                                "font-semibold underline":
                                    currentSort === "price_desc",
                                "text-muted-foreground":
                                    currentSort !== "price_desc",
                            })}
                        >
                            Price (High to Low)
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
