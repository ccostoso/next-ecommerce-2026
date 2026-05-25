import BreadcrumbsSkeleton from "../../components/skeletons/BreadcrumbsSkeleton";
import CategorySidebarSkeleton from "../../components/skeletons/CategorySidebarSkeleton";
import ProductsSkeleton from "../../components/skeletons/ProductsSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <main className="container mx-auto p-4">
            <div className="flex gap-8">
                <div className="flex-none w-48">
                    <CategorySidebarSkeleton />
                </div>
                <div className="flex-1">
                    <BreadcrumbsSkeleton />
                    <div className="flex gap-3 text-sm mb-8">
                        <Skeleton className="h-4 w-14" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-34" />
                    </div>
                    <ProductsSkeleton />
                </div>
                <div className="flex-none w-48">
                    <h2 className="font-medium mb-4">Sorting</h2>
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                </div>
            </div>
        </main>
    );
}
