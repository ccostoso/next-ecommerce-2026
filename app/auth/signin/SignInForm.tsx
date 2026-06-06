import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import type { UseFormReturn, SubmitHandler } from "react-hook-form";
import { LoginSchemaType } from "@/lib/schemas";

type SignInFormProps = {
    form: UseFormReturn<LoginSchemaType>; // Replace with the actual type from react-hook-form
    onSubmit: SubmitHandler<LoginSchemaType>; // Replace with the actual data type
    isLoading: boolean;
};

export default function SignInForm({
    form,
    onSubmit,
    isLoading,
}: SignInFormProps) {
    return (
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                                <FieldError errors={[fieldState.error]} />
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
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="default"
                    className="w-full mt-4"
                    disabled={isLoading}
                >
                    {isLoading ? "Signing in..." : "Submit"}
                </Button>
            </FieldGroup>
        </form>
    );
}
