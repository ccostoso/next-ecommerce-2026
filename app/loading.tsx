import ProductsSkeleton from "./_components/ProductsSkeleton";

export default function Loading() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Home</h1>
            <ProductsSkeleton />
        </div>
    );
}
