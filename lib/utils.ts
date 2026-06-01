import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);
}

// Utility function to ensure that a value is a positive integer, otherwise return a fallback value.
export function toPositiveInt(value: number | undefined, fallback: number) {
    return typeof value === "number" && Number.isInteger(value) && value > 0
        ? value
        : fallback;
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}