import { Home } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "./ui/breadcrumb";
import React from "react";

type BreadcrumbsProps = {
    items: { label: string; href: string; active?: boolean }[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <Breadcrumb className="mb-6">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">
                        <Home className="w-4 h-4" />
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        <BreadcrumbSeparator className="mx-2" />
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href={item.href}
                                className={item.active ? "active" : ""}
                                aria-current={item.active ? "page" : undefined}
                            >
                                {item.label}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
