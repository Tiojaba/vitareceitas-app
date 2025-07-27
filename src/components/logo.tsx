import * as React from 'react';
import { cn } from "@/lib/utils"

export const Logo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("text-primary", className)}
        {...props}
    >
        <path d="M3 7l2 2.5v10l-2 2.5" />
        <path d="M21 7l-2 2.5v10l2 2.5" />
        <path d="M8 7h8" />
        <path d="M8 12h8" />
        <path d="M8 17h8" />
        <path d="M5 9.5L8 7" />
        <path d="M5 14.5l3-2.5" />
        <path d="M5 19.5l3-2.5" />
        <path d="M19 9.5L16 7" />
        <path d="M19 14.5l-3-2.5" />
        <path d="M19 19.5l-3-2.5" />
    </svg>
);
