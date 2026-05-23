import Breadcrumbs from "@/components/Breadcrumbs";

type SearchPageProps = {
    searchParams: Promise<{
        q?: string;
    }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
                Search Results for &quot;{q}&quot;
            </h1>
        </div>
    );
}
