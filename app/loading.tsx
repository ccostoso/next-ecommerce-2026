import { ProductCardSkeleton } from "./_components/ProductCardSkeleton";

export default function Loading() {
    return (
        // <div className="flex h-screen items-center justify-center">
        //     <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
        // </div>
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Home</h1>
            <p>Showing {Array.from({ length: 5 }).length} products</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
