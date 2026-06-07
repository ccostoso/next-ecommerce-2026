import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { } from "next-auth/jwt"
import { LoginSchema } from "./schemas"
import { prisma } from "./prisma"
import { authConfig } from "./auth.config"
import { verifyPassword } from "./passwords"

declare module "next-auth" {
    interface User {
        id: string;
        email: string;
        name?: string | null;
        role?: string;
    }

    interface Session {
        user: {
            id: string;
            email: string;
            name?: string | null;
            role?: string;
        };
        refreshedAt?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        email?: string;
        name?: string | null;
        role?: string;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
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

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    };
                } catch (error) {
                    console.error("Error during authentication:", error);
                    return null;
                }
            },
        }),
    ],
})
