import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { SessionProvider } from "next-auth/react"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: {
        default: "Next Commerce",
        template: "%s | Next Commerce",
    },
    description:
        "A demo e-commerce application built with Next.js 13 and Tailwind CSS.",
    openGraph: {
        title: "Next Commerce",
        description:
            "A demo e-commerce application built with Next.js 13 and Tailwind CSS.",
        url: process.env.NEXT_PUBLIC_BASE_URL,
        siteName: "Next Commerce",
        locale: "en-US",
        type: "website",
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
            suppressHydrationWarning
        >
            <body className="min-h-screen flex flex-col">
                <SessionProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <Navbar />
                        {children}
                        <Footer />
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    )
}
