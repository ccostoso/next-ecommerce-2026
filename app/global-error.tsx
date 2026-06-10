"use client" // Error boundaries must be Client Components

type GlobalErrorProps = {
    _error: Error & { digest?: string }
    unstable_retry: () => void
}

export default function GlobalError({
    _error,
    unstable_retry,
}: GlobalErrorProps) {
    void _error // Required to prevent "error is defined but never used" TypeScript error

    return (
        <html>
            <body>
                <h2>Something went wrong!</h2>
                <button onClick={() => unstable_retry()}>Try again</button>
            </body>
        </html>
    )
}
