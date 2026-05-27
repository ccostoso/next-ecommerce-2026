import { getProducts, getProductsParams } from "@/lib/actions";
import ProductList from "./ProductList";
import { sleep } from "@/lib/utils";

type ProductListDataProps = {
    params: getProductsParams;
};

export default async function ProductListData({
    params,
}: ProductListDataProps) {
    await sleep(1000);

    const products = await getProducts(params);

    return <ProductList products={products} />;
}
