import BreadcrumbsSkeleton from "../components/skeletons/BreadcrumbsSkeleton";
import ProductsSkeleton from "../components/skeletons/ProductsSkeleton";

export default function Loading() {
    return (
        <div className="container mx-auto p-4">
            <BreadcrumbsSkeleton />
            <ProductsSkeleton />
        </div>
    );
}
