import { useEffect, useRef } from 'react';

interface UsePageVisibilityOptions {
  onVisible?: () => void;
  onHidden?: () => void;
}

export function usePageVisibility(options: UsePageVisibilityOptions = {}) {
  const { onVisible, onHidden } = options;
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisibleRef.current = false;
        onHidden?.();
      } else {
        isVisibleRef.current = true;
        onVisible?.();
      }
    };

    const handleBeforeUnload = () => {
      isVisibleRef.current = false;
      onHidden?.();
    };

    // Listen for page visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [onVisible, onHidden]);

  return {
    isVisible: isVisibleRef.current,
  };
}
