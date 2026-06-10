"use client"

import { useActionState, useEffect, useRef, type SubmitEvent } from "react"
import { Button } from "@/components/ui/button"
import { handleCheckout } from "@/lib/actions/cart-actions"

export default function CheckoutForm() {
    // useActionState is a custom hook that manages the state of a server action,
    // including pending state and any returned data or errors.
    const [state, formAction, isPending] = useActionState(handleCheckout, null)
    const hasSubmittedRef = useRef(false)

    // This function captures the form submission event to prevent multiple submissions.
    const handleSubmitCapture = (event: SubmitEvent<HTMLFormElement>) => {
        if (hasSubmittedRef.current || isPending) {
            event.preventDefault()
            return
        }

        hasSubmittedRef.current = true
    }

    // Reset lock if action resolves without redirect (for example, server-side validation error).
    useEffect(() => {
        if (!isPending) {
            hasSubmittedRef.current = false
        }
    }, [isPending])

    return (
        <form action={formAction} onSubmitCapture={handleSubmitCapture}>
            {state?.error && (
                <p className="text-destructive text-sm mb-2">{state.error}</p>
            )}
            <Button size="lg" className="mt-4 w-full" disabled={isPending}>
                {isPending ? "Processing..." : "Proceed to checkout"}
            </Button>
        </form>
    )
}
