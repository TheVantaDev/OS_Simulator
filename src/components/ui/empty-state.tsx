import { LucideIcon } from "lucide-react";
import { cn } from "./utils";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
    iconClassName?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
    iconClassName
}: EmptyStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center p-8 text-center animate-in fade-in-50 zoom-in-95 duration-300",
            className
        )}>
            {Icon && (
                <div className="bg-white/5 p-4 rounded-full mb-4">
                    <Icon className={cn("w-10 h-10 text-white/40", iconClassName)} />
                </div>
            )}
            <h3 className="text-xl font-medium text-white mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-white/50 text-sm max-w-[250px] leading-relaxed mb-6">
                    {description}
                </p>
            )}
            {action && (
                <div className="mt-2">
                    {action}
                </div>
            )}
        </div>
    );
}
