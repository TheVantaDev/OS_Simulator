import { createContext, useContext } from 'react';

export type BeforeCloseHandler = () => boolean | Promise<boolean>;

export interface WindowContextType {
    setBeforeClose: React.Dispatch<React.SetStateAction<BeforeCloseHandler | null>>;
    forceClose: () => void;
    data?: any;
}

export const WindowContext = createContext<WindowContextType | null>(null);

export const useWindow = () => {
    const context = useContext(WindowContext);
    // It's possible for apps to be rendered outside a Window (e.g. desktop?), 
    // but in this OS, they are usually in a window. 
    // We'll return null or dummy if not found, to be safe? 
    // Better to just follow standard pattern: if undefined, it might throw, or we return strict type.
    // Given the request "without breaking other apps", other apps simply won't use this hook.
    // If an app uses this hook and is somehow not in a window, it should probably know directly.
    return context;
};
