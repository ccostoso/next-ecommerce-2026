"use client";

import { signOut, useSession } from "next-auth/react";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";

export default function AuthStatus() {
    const { status } = useSession();

    switch (status) {
        case "loading":
            return <Skeleton className="w-9 h-9"></Skeleton>;
        case "unauthenticated":
            return (
                <Button variant="outline" size="icon" asChild>
                    <Link href="/auth/signin">
                        <LogIn className="h-5 w-5" />
                    </Link>
                </Button>
            );
        default:
            // case "authenticated":
            return (
                <Button variant="outline" size="icon" onClick={() => signOut()}>
                    <LogOut className="h-5 w-5" />
                </Button>
            );
    }
}
