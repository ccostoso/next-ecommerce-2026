import { Suspense } from "react";
import CategorySidebarSkeleton from "../_components/skeletons/CategorySidebarSkeleton";
import CategorySidebar from "@/components/CategorySidebar";

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="container mx-auto p-4">
            <div className="flex gap-8">
                <div className="flex-none w-48">
                    <h2 className="font-medium mb-4">Categories</h2>

                    <Suspense fallback={<CategorySidebarSkeleton />}>
                        {/* <CategorySidebar activeCategory={slug} /> */}
                    </Suspense>
                </div>
                <div className="flex-1">{children}</div>
                <div className="flex-none w-48">
                    <h2 className="font-medium mb-4">Sorting</h2>
                </div>
            </div>
        </main>
    );
}
