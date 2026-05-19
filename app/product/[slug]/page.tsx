import { Card, CardContent } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/actions";
import { formatPrice, sleep } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";

type ProductPageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return {
            title: "Product Not Found",
        };
    }

    return {
        title: product.name,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            images: product.image
                ? [
                      {
                          url: product.image,
                          alt: product.name,
                          width: 800,
                          height: 600,
                      },
                  ]
                : undefined,
        },
    };
}

export default async function ProductPage(props: ProductPageProps) {
    const { slug } = await props.params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    await sleep(1500);

    return (
        <main className="container mx-auto p-4">
            <Card className="max-w-3xl mx-auto">
                <CardContent className="p-6">
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="font-semibold text-lg">
                            {formatPrice(product.price)}
                        </span>
                        <Badge variant={"outline"}>
                            {product.category?.name}
                        </Badge>
                    </div>

                    <Separator className="my-4"></Separator>

                    <div className="space-y-2">
                        <h2 className="font-medium">Description</h2>
                        <p>{product.description}</p>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
