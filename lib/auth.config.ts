import { NextAuthConfig } from "next-auth"

type SharedAuthConfig = Omit<NextAuthConfig, "providers">

export const authConfig: SharedAuthConfig = {
    secret: process.env.BETTER_AUTH_SECRET,
    pages: {
        signIn: "/auth/signin",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string | undefined
            }
            return session
        },
    },
} satisfies SharedAuthConfig
