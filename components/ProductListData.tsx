import { getProducts, getProductsParams } from "@/lib/actions/product-actions"
import ProductList from "./ProductList"

type ProductListDataProps = {
    params: getProductsParams
}

export default async function ProductListData({
    params,
}: ProductListDataProps) {
    const products = await getProducts(params)

    return <ProductList products={products} />
}
