import * as SwitchPrimitive from "@radix-ui/react-switch";

interface CustomSwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    accentColor?: string;
}

export function CustomSwitch({ checked, onCheckedChange, accentColor }: CustomSwitchProps) {
    return (
        <SwitchPrimitive.Root
            checked={checked}
            onCheckedChange={onCheckedChange}
            style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                width: '44px',
                height: '24px',
                backgroundColor: checked ? (accentColor || '#3b82f6') : 'rgba(255, 255, 255, 0.2)',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 200ms',
                WebkitTapHighlightColor: 'transparent',
            }}
        >
            <SwitchPrimitive.Thumb
                style={{
                    display: 'block',
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'white',
                    borderRadius: '9999px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 200ms',
                    transform: checked ? 'translateX(22px)' : 'translateX(2px)',
                }}
            />
        </SwitchPrimitive.Root>
    );
}
