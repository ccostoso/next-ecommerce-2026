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
import { RegistrationSchemaType } from "@/lib/schemas";

type SignUpFormProps = {
    form: UseFormReturn<RegistrationSchemaType>; // Replace with the actual type from react-hook-form
    onSubmit: SubmitHandler<RegistrationSchemaType>; // Replace with the actual data type
    isLoading: boolean;
};

export default function SignUpForm({
    form,
    onSubmit,
    isLoading,
}: SignUpFormProps) {
    return (
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                {/* Name Field */}
                <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                                htmlFor="signup-name"
                                className="block text-sm font-medium"
                            >
                                Name
                            </FieldLabel>
                            <Input
                                {...field}
                                id="signup-name"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter your name"
                                autoComplete="off"
                                className="w-full rounded-md border px-3 py-2"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                {/* Email Field */}
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                                htmlFor="signup-email"
                                className="block text-sm font-medium"
                            >
                                Email
                            </FieldLabel>
                            <Input
                                {...field}
                                id="signup-email"
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
                                htmlFor="signup-password"
                                className="block text-sm font-medium"
                            >
                                Password
                            </FieldLabel>
                            <Input
                                {...field}
                                type="password"
                                id="signup-password"
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

                {/* Confirm Password Field */}
                <Controller
                    name="confirmPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                                htmlFor="signup-confirm-password"
                                className="block text-sm font-medium"
                            >
                                Confirm Password
                            </FieldLabel>
                            <Input
                                {...field}
                                type="password"
                                id="signup-confirm-password"
                                aria-invalid={fieldState.invalid}
                                placeholder="Confirm your password"
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
                    {isLoading ? "Signing up..." : "Submit"}
                </Button>
            </FieldGroup>
        </form>
    );
}
