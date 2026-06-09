"use client"

import { signOut, useSession } from "next-auth/react"
import { Skeleton } from "./ui/skeleton"
import { Button } from "./ui/button"
import { LogIn, LogOut, User } from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "./ui/dropdown-menu"

export default function AuthStatus() {
    const { status, data: session } = useSession()

    switch (status) {
        case "loading":
            return <Skeleton className="w-9 h-9"></Skeleton>
        case "unauthenticated":
            return (
                <Button variant="outline" size="icon" asChild>
                    <Link href="/auth/signin">
                        <LogIn className="h-5 w-5" />
                    </Link>
                </Button>
            )
        default:
            // case "authenticated":
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <User className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                            {session?.user?.name ?? "Account"}
                        </DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href="/account">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut()}>
                            <LogOut className="h-5 w-5" />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
    }
}
