import { Suspense } from "react";
import CategorySidebarSkeleton from "../../components/skeletons/CategorySidebarSkeleton";
import CategorySidebar from "@/components/CategorySidebar";
import { prisma } from "@/lib/prisma-server";
import SortingControls from "@/components/SortingControls";

async function CategorySidebarData() {
    const categories = await prisma.category.findMany({
        select: {
            name: true,
            slug: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    return <CategorySidebar categories={categories} />;
}

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="container mx-auto p-4">
            <div className="flex gap-0 md:gap-8 flex-col-reverse md:flex-row">
                <div className="flex-none w-48 hidden lg:block">
                    <Suspense fallback={<CategorySidebarSkeleton />}>
                        <CategorySidebarData />
                    </Suspense>
                </div>
                <div className="flex-1">{children}</div>
                <div className="flex-none w-48">
                    <SortingControls />
                </div>
            </div>
        </main>
    );
}
