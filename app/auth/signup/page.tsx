"use client"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { RegistrationSchema, RegistrationSchemaType } from "@/lib/schemas"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import SignUpForm from "./SignUpForm"
import { registerUser } from "@/lib/actions/auth-actions"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const form = useForm<RegistrationSchemaType>({
        resolver: zodResolver(RegistrationSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (data: RegistrationSchemaType) => {
        form.clearErrors()

        try {
            const result = await registerUser(data)

            if (!result?.success) {
                setError(
                    result?.error ||
                        "An unexpected error occurred. Please try again.",
                )
                return
            }

            router.push("/auth/signin")
        } catch (error) {
            console.error(error)
            setError("An unexpected error occurred. Please try again.")
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center text-2xl font-bold">
                    <CardTitle>Create an account</CardTitle>
                </CardHeader>
                <CardContent>
                    <p
                        className="min-h-5 text-sm text-destructive text-center"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {error ?? "\u00A0"}
                    </p>
                    <SignUpForm
                        form={form}
                        onSubmit={onSubmit}
                        isLoading={false}
                    />
                </CardContent>
                <CardFooter className="mt-6 justify-center text-center">
                    <p className="font-medium text-muted-foreground text-center">
                        Already have an account?{" "}
                        <Link
                            className="text-primary hover:underline"
                            href="/auth/signin"
                        >
                            Click here to sign in.
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </main>
    )
}
