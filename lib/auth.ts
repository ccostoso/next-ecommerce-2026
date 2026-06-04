import NextAuth from "next-auth"
import bcrypt from "bcryptjs"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "./schemas"
import { prisma } from "./prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                const parsedCredentials = LoginSchema.safeParse(credentials);
                if (!parsedCredentials.success) {
                    console.error("Invalid credentials format:", parsedCredentials.error);
                    return null;
                }
                const { email, password } = parsedCredentials.data;
                // Here you would typically fetch the user from your database
                // and verify the password using bcrypt

                try {
                    const user = await prisma.user.findUnique({ where: { email } });
                    if (!user) {
                        console.warn("User not found for email:", email);
                        return null;
                    }

                    const isPasswordValid = await verifyPassword(password, user.password);
                    if (!isPasswordValid) {
                        console.warn("Invalid password for email:", email);
                        return null;
                    }

                    // Return the user object (you can include any additional fields you want)
                    // return { id: user.id, email: user.email };
                    return user;
                } catch (error) {
                    console.error("Error during authentication:", error);
                    return null;
                }
            },
        }),
    ],
    secret: process.env.BETTER_AUTH_SECRET,
    pages: {
        signIn: "/auth/signin",
    },
})

export async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword)
}