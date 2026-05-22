import { Skeleton } from "@/components/ui/skeleton";
import ProductCardSkeleton from "./ProductCardSkeleton";

const PAGE_SIZE = 3;

export default function ProductsSkeleton() {
    return (
        <>
            <Skeleton className="h-6 w-1/8 mb-4" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        </>
    );
}
