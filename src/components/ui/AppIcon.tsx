import { memo } from 'react';
import { useAppContext } from '../AppContext';
import { AppMetadata } from '../../config/appRegistry';
import { cn } from './utils';

interface AppIconProps {
    app: AppMetadata;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showIcon?: boolean;
}

const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
};

const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12"
};

function AppIconComponent({ app, className, size = 'md', showIcon = true }: AppIconProps) {
    const { disableGradients } = useAppContext();
    const IconComponent = app.icon;

    const bgClass = disableGradients
        ? '' // Solid color applied via inline style
        : `bg-gradient-to-br ${app.iconColor}`;

    const style = disableGradients
        ? { backgroundColor: app.iconSolid }
        : {};

    return (
        <div
            className={cn(
                "rounded-xl flex items-center justify-center text-white shrink-0 transition-all",
                sizeClasses[size],
                bgClass,
                className
            )}
            style={style}
        >
            {showIcon && <IconComponent className={iconSizes[size]} />}
        </div>
    );
}

export const AppIcon = memo(AppIconComponent);
