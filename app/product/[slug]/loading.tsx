import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <main className="container mx-auto p-4">
            <Card className="max-w-3xl mx-auto">
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative rounded-lg overflow-hidden aspect-video">
                        <Skeleton className="h-full w-full" />
                    </div>
                    <div>
                        <Skeleton className="h-8 w-1/2 mb-4" />
                        <div className="flex items-center gap-2 mb-4">
                            <Skeleton className="h-5 w-1/8" />
                            <Skeleton className="h-5 w-1/8" />
                        </div>

                        <Separator className="my-4"></Separator>

                        <div className="space-y-2">
                            <h2 className="font-medium">Description</h2>
                            <Skeleton className="h-5 w-full" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
