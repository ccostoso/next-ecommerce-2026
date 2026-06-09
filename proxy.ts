import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

const { auth } = NextAuth({
    ...authConfig,
    providers: [],
})

export { auth as proxy }