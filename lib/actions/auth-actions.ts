"use server"

import { RegistrationSchema, type RegistrationSchemaType } from "@/lib/schemas"
import { prisma } from "../prisma-server"
import { hashPassword } from "../passwords"

export async function registerUser(data: RegistrationSchemaType) {
    const parsedData = RegistrationSchema.safeParse(data)

    if (!parsedData.success) {
        return {
            success: false,
            error: "Invalid registration data",
            issues: parsedData.error.issues,
        }
    }

    const { name, email, password } = parsedData.data

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } })

        if (existingUser) {
            return {
                success: false,
                error: "An unexpected error occurred. Please try again.",
                issues: [],
            }
        }

        const hashedPassword = await hashPassword(password)

        const newUser = await prisma.user.create({
            data: {
                name: name || null,
                email,
                password: hashedPassword,
                role: "user",
            },
        })

        const { password: userPassword, ...userWithoutPassword } = newUser
        void userPassword

        return { success: true, user: userWithoutPassword }
    } catch (error) {
        console.error("An unexpected error occurred. Please try again.", error)
        return {
            success: false,
            error: "An unexpected error occurred. Please try again.",
        }
    }
}
