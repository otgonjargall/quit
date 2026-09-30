"use client";

import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Header() {
    const { isSignedIn, isLoaded } = useUser();


    if (!isLoaded) {
        return <header className="h-10 border-b" />;
    }

    return (
        <header className="flex h-10 items-center justify-between border-b bg-background px-4">
            <span className="text-sm font-semibold">Quiz app</span>
            <div className="flex items-center gap-2">
            {!isSignedIn ? (
                <>
                    <SignInButton />
                    <SignUpButton>
                        <button className="cursor-pointer rounded-sm bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
                            Sign Up
                        </button>
                    </SignUpButton>
                </>
            ) : (
                <UserButton />
            )}
            </div>
        </header>
    );
}