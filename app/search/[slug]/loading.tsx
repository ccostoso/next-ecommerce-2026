import ProductsSkeleton from "../../_components/skeletons/ProductsSkeleton";
import BreadcrumbsSkeleton from "@/app/_components/skeletons/BreadcrumbsSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <>
            <BreadcrumbsSkeleton />
            <div className="flex gap-3 text-sm mb-8">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-34" />
            </div>
            <ProductsSkeleton />
        </>
    );
}
