import { z } from "zod";

export const LoginSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string()
        .min(8, {
            message: "Password must be at least 8 characters long"
        })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]+$/, {
            message: "Password must contain at least one letter, one number, and one special character"
        }),
});

type LoginSchemaType = z.infer<typeof LoginSchema>;