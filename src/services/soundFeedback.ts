
import { soundManager } from './sound';

/**
 * General UI sound feedback utility
 * Use this for non-intrusive UI interactions like clicks, hovers, and window actions.
 */
export const feedback = {
    /**
     * Play a subtle click sound
     * Use for button presses, checkbox toggles, etc.
     */
    click: () => soundManager.play('click'),

    folder: () => soundManager.play('folder'),

    /**
     * Play a very subtle hover sound
     * Use sparingly, primarily for high-interactivity elements (dock items, important buttons)
     */
    hover: () => soundManager.play('hover'),

    /**
     * Play a window opening sound
     */
    windowOpen: () => soundManager.play('window-open'),

    /**
     * Play a window closing sound
     */
    windowClose: () => soundManager.play('window-close'),
};
