import { z } from "zod"

export const LoginSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string()
        .min(8, {
            message: "Password must be at least 8 characters long"
        })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]+$/, {
            message: "Password must contain at least one letter, one number, and one special character"
        }),
})

export type LoginSchemaType = z.infer<typeof LoginSchema>

export const RegistrationSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
    email: z.email({ message: "Invalid email address" }),
    password: z.string()
        .min(8, {
            message: "Password must be at least 8 characters long"
        })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]+$/, {
            message: "Password must contain at least one letter, one number, and one special character"
        }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export type RegistrationSchemaType = z.infer<typeof RegistrationSchema>