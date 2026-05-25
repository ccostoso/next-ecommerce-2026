import { Skeleton } from "@/components/ui/skeleton";

export default function CategorySidebarSkeleton() {
    return (
        <div className="w-31.25 p-4 rounded space-y-3 h-full">
            <h3 className="text-sm text-muted-foreground mb-2">Collections</h3>
            <ul>
                <li>
                    <Skeleton className="h-6 w-15 mb-1" />
                </li>
                <li>
                    <Skeleton className="h-6 w-15 mb-1" />
                </li>
                <li>
                    <Skeleton className="h-6 w-15 mb-1" />
                </li>
            </ul>
        </div>
    );
}
