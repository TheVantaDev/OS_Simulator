import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to manage fullscreen state and toggle functionality
 * @returns Object with isFullscreen state and toggleFullscreen function
 */
export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const checkFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    checkFullscreen();
    document.addEventListener('fullscreenchange', checkFullscreen);
    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreen);
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        console.warn('Failed to enter fullscreen');
      });
    } else {
      document.exitFullscreen().catch(() => {
        console.warn('Failed to exit fullscreen');
      });
    }
  }, []);

  return {
    isFullscreen,
    toggleFullscreen,
  };
}
