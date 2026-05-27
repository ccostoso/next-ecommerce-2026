import ProductsSkeleton from "../../../components/skeletons/ProductsSkeleton";
import BreadcrumbsSkeleton from "@/components/skeletons/BreadcrumbsSkeleton";

export default function Loading() {
    return (
        <>
            <BreadcrumbsSkeleton />
            <ProductsSkeleton />
        </>
    );
}
