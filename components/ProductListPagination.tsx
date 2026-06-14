import { cn } from "@/lib/utils"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "./ui/pagination"

type ProductListPaginationProps = {
    page: number
    totalPages: number
    basePath?: string
    query?: Record<string, string | undefined>
}

export function ProductListPagination({
    page,
    totalPages,
    basePath = "",
    query = {},
}: ProductListPaginationProps) {
    const isFirstPage = page === 1
    const isLastPage = page === totalPages

    const createPageHref = (nextPage: number) => {
        const params = new URLSearchParams()

        for (const [key, value] of Object.entries(query)) {
            if (!value) continue
            params.set(key, value)
        }

        params.set("page", String(nextPage))

        const queryString = params.toString()
        return queryString
            ? `${basePath}?${queryString}`
            : basePath || "?page=1"
    }

    return (
        <Pagination className="mt-8">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={createPageHref(page - 1)}
                        className={cn(
                            isFirstPage && "pointer-events-none opacity-50",
                        )}
                    />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1
                    if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                        return (
                            <PaginationItem key={pageNum}>
                                <PaginationLink
                                    href={createPageHref(pageNum)}
                                    isActive={page === pageNum}
                                >
                                    {pageNum}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    }
                    return null
                })}

                <PaginationItem>
                    <PaginationNext
                        href={createPageHref(page + 1)}
                        className={cn(
                            isLastPage && "pointer-events-none opacity-50",
                        )}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
