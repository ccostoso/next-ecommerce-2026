"use client";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { RegistrationSchema, RegistrationSchemaType } from "@/lib/schemas";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SignInForm from "./SignUpForm";

export default function SignUpPage() {
    const form = useForm<RegistrationSchemaType>({
        resolver: zodResolver(RegistrationSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: RegistrationSchemaType) => {
        console.log("Form data:", data);
    };

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
                        {"\u00A0"}
                    </p>
                    <SignInForm
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
    );
}
