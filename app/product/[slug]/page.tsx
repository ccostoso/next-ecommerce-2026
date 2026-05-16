import { getProductBySlug } from "@/lib/actions";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { notFound } from "next/navigation";

type ProductPageProps = {
    params: Promise<{ slug: string }>;
};

export default async function ProductPage(props: ProductPageProps) {
    const { slug } = await props.params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">{product.name}</h1>
            <div className="relative aspect-video mb-4">
                {product.image && (
                    <Image
                        src={product.image}
                        alt={product.name}
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        fill
                    />
                )}
            </div>
            <p className="mb-4">{product.description}</p>
            <p className="text-xl font-semibold">
                {formatPrice(product.price)}
            </p>
        </div>
    );
}
