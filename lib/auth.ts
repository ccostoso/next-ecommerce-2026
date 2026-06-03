import NextAuth from "next-auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [],
    secret: process.env.BETTER_AUTH_SECRET,
})