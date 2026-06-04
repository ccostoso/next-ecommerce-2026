import NextAuth from "next-auth"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [],
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