
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const glassButtonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-white/5 border border-white/10 text-white hover:bg-white/10 active:bg-white/20 shadow-sm backdrop-blur-sm",
                ghost: "hover:bg-white/10 text-white/70 hover:text-white",
                danger: "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20",
                primary: "bg-white text-black hover:bg-white/90 border border-transparent shadow-md", // For high contrast actions
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9",
                iconSm: "h-8 w-8",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface GlassButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
    asChild?: boolean;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(glassButtonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };
