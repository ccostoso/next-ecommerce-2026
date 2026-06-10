"use client"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { LoginSchema, LoginSchemaType } from "@/lib/schemas"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signIn, useSession } from "next-auth/react"
import { useState } from "react"
import SignInForm from "./SignInForm"
import { useRouter } from "next/navigation"

export default function SignInPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { update: updateSession } = useSession()
    const router = useRouter()

    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (data: LoginSchemaType) => {
        setIsLoading(true)

        try {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
                callbackUrl: "/",
            })

            if (result?.error) {
                if (result.error === "CredentialsSignin") {
                    setError("Invalid email or password.")
                } else {
                    setError("An unexpected error occurred. Please try again.")
                }
            } else {
                setError(null)
                await updateSession()
                router.push("/")
            }
        } catch (error) {
            setError("An unexpected error occurred. Please try again.")
        }

        setIsLoading(false)
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center text-2xl font-bold">
                    <CardTitle>Sign in to your account</CardTitle>
                </CardHeader>
                <CardContent>
                    <p
                        className="min-h-5 text-sm text-destructive text-center"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {error ?? "\u00A0"}
                    </p>
                    <SignInForm
                        form={form}
                        onSubmit={onSubmit}
                        isLoading={isLoading}
                    />
                </CardContent>
                <CardFooter className="mt-6 justify-center text-center">
                    <p className="font-medium text-muted-foreground text-center">
                        Don&apos;t have an account?{" "}
                        <Link
                            className="text-primary hover:underline"
                            href="/auth/signup"
                        >
                            Click here to register.
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </main>
    )
}
