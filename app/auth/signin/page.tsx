import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignInPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center text-2xl font-bold">
                    <CardTitle>Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="block text-sm font-medium"
                            >
                                Email
                            </Label>
                            <Input
                                type="email"
                                id="email"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring focus:ring-primary/50"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="password"
                                className="block text-sm font-medium"
                            >
                                Password
                            </Label>
                            <Input
                                type="password"
                                id="password"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:ring focus:ring-primary/50"
                                placeholder="Enter your password"
                            />
                        </div>
                        <Button
                            type="submit"
                            // className="w-full rounded-md px-4 py-2 hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            variant="default"
                            className="w-full"
                        >
                            Sign In
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="mt-6 justify-center text-center">
                    <p className="font-medium text-muted-foreground text-center">
                        Not registered?{" "}
                        <Link
                            className="text-primary hover:underline"
                            href="/auth/signup"
                        >
                            Create a new account.
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </main>
    );
}
