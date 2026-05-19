export default function Footer() {
    return (
        <footer className="mt-auto border-t border-dashed py-6 bg-background">
            <div className="container mx-auto text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Next Commerce App. All rights
                reserved.
            </div>
        </footer>
    );
}
