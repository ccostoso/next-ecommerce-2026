import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <main className="container mx-auto py-4">
            <div className="flex flex-col mb-8">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between border-b py-4"
                    >
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-16 w-16 rounded-md" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-8 w-24 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <div className="space-y-3 p-4">
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-px w-full my-2" />
                    <div className="flex justify-between font-semibold">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-10 w-full mt-4" />
                </div>
            </div>
        </main>
    );
}
