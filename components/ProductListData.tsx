import {
    getProductListData,
    getProductListDataParams,
} from "@/lib/actions/product-actions"
import ProductList from "./ProductList"

type ProductListDataProps = {
    params: getProductListDataParams
}

export default async function ProductListData({
    params,
}: ProductListDataProps) {
    const products = await getProductListData(params)

    return <ProductList products={products} />
}
