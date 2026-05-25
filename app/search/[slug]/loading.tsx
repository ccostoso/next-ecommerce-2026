import ProductsSkeleton from "../../_components/skeletons/ProductsSkeleton";
import BreadcrumbsSkeleton from "@/app/_components/skeletons/BreadcrumbsSkeleton";
import CategorySidebarSkeleton from "@/app/_components/skeletons/CategorySidebarSkeleton";

export default function Loading() {
    return (
        <div className="container mx-auto p-4">
            <BreadcrumbsSkeleton />
            <div className="flex gap-4">
                <div className="flex-none">
                    <CategorySidebarSkeleton />
                </div>
                <div className="flex-1">
                    <ProductsSkeleton />
                </div>
            </div>
        </div>
    );
}
