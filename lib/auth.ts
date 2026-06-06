import NextAuth, { Session, User } from "next-auth"
import bcrypt from "bcryptjs"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema, RegistrationSchema, RegistrationSchemaType } from "./schemas"
import { prisma } from "./prisma"
import { JWT } from "next-auth/jwt"

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
        id: string;
        email: string;
        name?: string | null;
        role?: string;
    }
}

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
    secret: process.env.BETTER_AUTH_SECRET,
    callbacks: {
        async jwt({ token, user }: { token: JWT, user: User }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: { session: Session, token: JWT }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
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

export async function registerUser(data: RegistrationSchemaType) {
    const parsedData = RegistrationSchema.safeParse(data);

    if (!parsedData.success) {
        return {
            success: false,
            error: "Invalid registration data",
            issues: parsedData.error.issues,
        };
    }

    const { name, email, password } = parsedData.data;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });


        if (existingUser) {
            return {
                success: false,
                error: "Error creating user",
                issues: [],
            };
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                name: name || null,
                email,
                password: hashedPassword,
                role: "user",
            },
        });

        const { password: _, ...userWithoutPassword } = newUser;

        return { success: true, user: userWithoutPassword };
    } catch (error) {
        console.error("Error creating user:", error);
        return {
            success: false,
            error: "Error creating user",
        };
    }
}