"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoginSchema, LoginSchemaType } from "@/lib/schemas";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";

export default function SignInPage() {
    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (data: LoginSchemaType) => {
        console.log("Form Data:", data);
        // Here you would typically send the data to your server for authentication
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center text-2xl font-bold">
                    <CardTitle>Sign in to your account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        className="space-y-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FieldGroup>
                            {/* Email Field */}
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel
                                            htmlFor="login-email"
                                            className="block text-sm font-medium"
                                        >
                                            Email
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="login-email"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter your email"
                                            autoComplete="off"
                                            className="w-full rounded-md border px-3 py-2"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />

                            {/* Password Field */}
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel
                                            htmlFor="login-password"
                                            className="block text-sm font-medium"
                                        >
                                            Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            type="password"
                                            id="login-password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter your password"
                                            autoComplete="off"
                                            className="w-full rounded-md border px-3 py-2"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                // className="w-full rounded-md px-4 py-2 hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                variant="default"
                                className="w-full mt-4"
                            >
                                Submit
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className="mt-6 justify-center text-center">
                    <p className="font-medium text-muted-foreground text-center">
                        Not registered?{" "}
                        <Link
                            className="text-primary hover:underline"
                            href="/auth/signup"
                        >
                            Click here to create an account.
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </main>
    );
}
