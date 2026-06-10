import useSWR, { Fetcher, mutate } from "swr"

type CartResponse = {
    size: number
}

const fetcher: Fetcher<CartResponse, string> = async (url) => {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error("Failed to fetch cart")
    }
    return response.json()
}

export function useCart() {
    const { data, error, isLoading } = useSWR<CartResponse>("/api/cart", fetcher, {
        fallbackData: { size: 0 },
    })

    const revalidateCart = () => {
        // Trigger a revalidation to update the cart size
        mutate("/api/cart")
    }

    return {
        size: data?.size || 0,
        isLoading,
        error,
        revalidateCart,
    }
}