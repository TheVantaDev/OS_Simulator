
import * as React from "react";
import { cn } from "./utils";

export interface GlassInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
    ({ className, type, icon, ...props }, ref) => {
        return (
            <div className="relative flex items-center w-full">
                {icon && (
                    <div className="absolute left-3 text-white/40 pointer-events-none flex items-center justify-center">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-9 w-full rounded-md border border-white/10 bg-black/20 px-3 py-1 text-sm text-white shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 disabled:cursor-not-allowed disabled:opacity-50",
                        icon && "pl-9", // Add padding if icon exists
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);
GlassInput.displayName = "GlassInput";

export { GlassInput };
