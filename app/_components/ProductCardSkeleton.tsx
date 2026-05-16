import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
    return (
        <Card className="pt-0 overflow-hidden">
            <div className="relative aspect-video">
                <Skeleton className="w-full h-full"></Skeleton>
            </div>
            <CardHeader>
                <Skeleton className="w-1/3 h-3"></Skeleton>
                <Skeleton className="w-full h-6 mt-1"></Skeleton>
            </CardHeader>

            <CardFooter>
                <Skeleton className="w-full h-4"></Skeleton>
            </CardFooter>
        </Card>
    );
}
