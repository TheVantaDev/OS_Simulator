import { ReactNode } from 'react';
import { cn } from './utils';

interface ResponsiveGridProps {
    children: ReactNode;
    minItemWidth?: number;
    className?: string;
    gap?: number;
}

export function ResponsiveGrid({
    children,
    minItemWidth = 120,
    className,
    gap = 3 // default to gap-3 (0.75rem / 12px) if using inline gap, but we'll use Tailwind gap classes usually
}: ResponsiveGridProps) {
    return (
        <div
            className={cn("grid", className)}
            style={{
                gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))`,
                gap: `${gap * 4}px`
            }}
        >
            {children}
        </div>
    );
}
