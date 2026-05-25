import BreadcrumbsSkeleton from "./_components/skeletons/BreadcrumbsSkeleton";
import ProductsSkeleton from "./_components/skeletons/ProductsSkeleton";

export default function Loading() {
    return (
        <div className="container mx-auto p-4">
            <BreadcrumbsSkeleton />
            <ProductsSkeleton />
        </div>
    );
}
