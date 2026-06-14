import { Card, CardContent } from "@/components/ui/card"
import {
    getCachedAllProducts,
    getCachedProductBySlug,
} from "@/lib/actions/product-actions"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Breadcrumbs from "@/components/Breadcrumbs"
import { AddToCartButton } from "@/components/AddToCartButton"

type ProductPageProps = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
    const { slug } = await params
    const product = await getCachedProductBySlug(slug)

    if (!product) {
        return {
            title: "Product Not Found",
        }
    }

    return {
        title: `Next Commerce - ${product.name}`,
        description: product.description,
        openGraph: {
            title: `Next Commerce - ${product.name}`,
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
    }
}

// Without revalidate set, this page will be statically generated at build time and won't update until
// the next build.
export const revalidate = 3600 // Revalidate every hour

export async function generateStaticParams() {
    const products = await getCachedAllProducts({ slug: true })
    return products.map((product) => ({ slug: product.slug }))
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params
    const product = await getCachedProductBySlug(slug)

    if (!product) notFound()

    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product.name,
        image: product.image,
        description: product.description,
        sku: product.id,
        offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            price: formatPrice(product.price),
            availability:
                product.inventory > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
        },
    }

    const breadcrumbItems = [
        { label: "Products", href: "/" },
        {
            label: product.category?.name,
            href: `/search/${product.category?.slug}`,
        },
        { label: product.name, href: `/product/${product.slug}`, active: true },
    ]

    return (
        <main className="container mx-auto p-4">
            <Breadcrumbs items={breadcrumbItems} />
            <Card>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="relative rounded-lg overflow-hidden min-h-64 md:h-full md:col-span-5">
                        {product.image && (
                            <Image
                                src={product.image}
                                alt={product.name}
                                sizes={
                                    "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                }
                                fill
                                priority
                                className="object-cover"
                            />
                        )}
                    </div>
                    <div className="md:col-span-7">
                        <h1 className="text-3xl font-bold mb-2">
                            {product.name}
                        </h1>
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

                        <Separator className="my-4"></Separator>

                        <div className="space-y-2">
                            <h2 className="font-medium">Availability</h2>
                            <div className="flex items-center gap-2">
                                {product.inventory ? (
                                    <Badge
                                        variant={"outline"}
                                        className="text-green-600"
                                    >
                                        In Stock
                                    </Badge>
                                ) : (
                                    <Badge
                                        variant={"destructive"}
                                        className="text-red-600"
                                    >
                                        Out of Stock
                                    </Badge>
                                )}

                                {product.inventory && (
                                    <span className="text-sm text-muted-foreground">
                                        {product.inventory} left
                                    </span>
                                )}
                            </div>
                        </div>

                        <Separator className="my-4"></Separator>

                        <div>
                            <AddToCartButton product={product} />
                        </div>
                    </div>
                </CardContent>
            </Card>
            {/* dangerouslySetInnerHTML will be fine as the content is generated from trusted data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </main>
    )
}
