import { Search } from "lucide-react";
import { Input } from "./ui/input";

export default function SearchInput() {
    return (
        <form className="relative w-full">
            <Search className="absolute w-4 h-4 left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="pl-9" />
        </form>
    );
}
