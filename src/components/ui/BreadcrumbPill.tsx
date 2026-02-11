
import { useState } from 'react';

interface BreadcrumbPillProps {
    name: string;
    isLast: boolean;
    accentColor: string;
    onClick: () => void;
}

export function BreadcrumbPill({ name, isLast, accentColor, onClick }: BreadcrumbPillProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`px-3 py-1 rounded-md text-sm transition-all duration-200 border ${isLast ? 'font-medium' : 'font-normal'
                }`}
            style={{
                backgroundColor: isHovered || isLast
                    ? accentColor
                    : 'rgba(55, 65, 81, 0.5)', // Default gray-700/50
                borderColor: isHovered || isLast
                    ? accentColor
                    : 'transparent',
                color: isHovered || isLast
                    ? '#FFFFFF'
                    : 'rgba(255, 255, 255, 0.9)',
                cursor: isLast ? 'default' : 'pointer',
                boxShadow: isHovered || isLast ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' : 'none',
                fontWeight: isLast ? 600 : 400
            }}
        >
            {name}
        </button>
    );
}
