import * as React from 'react';
import Image from 'next/image';
import { cn } from "@/lib/utils"

type LogoProps = {
    className?: string;
};

export const Logo = ({ className, ...props }: LogoProps) => (
    <Image
        src="https://i.imgur.com/ZOPB1Hp.png"
        alt="Comunidade Zero Lactose Logo"
        width={512}
        height={512}
        className={cn(className)}
        priority
        {...props}
    />
);
