import BreadcrumbsSkeleton from "@/components/skeletons/BreadcrumbsSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart } from "lucide-react";

export default function Loading() {
    return (
        <main className="container mx-auto p-4">
            <BreadcrumbsSkeleton />
            <Card>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="relative rounded-lg overflow-hidden aspect-video md:col-span-5">
                        <Skeleton className="h-full w-full" />
                    </div>
                    <div className="md:col-span-7">
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

                        <Separator className="my-4"></Separator>

                        <div className="space-y-2">
                            <h2 className="font-medium">Availability</h2>
                            <Skeleton className="h-5 w-1/4" />
                        </div>

                        <Separator className="my-4"></Separator>

                        <div>
                            <Button
                                disabled={true}
                                size="lg"
                                className="w-full"
                            >
                                <ShoppingCart className="mr-2" size={16} />
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
