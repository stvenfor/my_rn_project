import {useRef, useState} from 'react';

interface UseShortVideoGesturesOptions {
  onDoubleTapLike?: () => void;
  onSingleTap: () => void;
}

export function useShortVideoGestures({
  onDoubleTapLike,
  onSingleTap,
}: UseShortVideoGesturesOptions) {
  const [showPauseIcon, setShowPauseIcon] = useState(false);
  const [showLikeBurst, setShowLikeBurst] = useState(false);
  const lastTapRef = useRef(0);

  const flashPauseIcon = () => {
    setShowPauseIcon(true);
    setTimeout(() => setShowPauseIcon(false), 600);
  };

  const triggerLikeBurst = () => {
    setShowLikeBurst(true);
    onDoubleTapLike?.();
    setTimeout(() => setShowLikeBurst(false), 800);
  };

  const handlePress = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      triggerLikeBurst();
      lastTapRef.current = 0;
      return;
    }
    lastTapRef.current = now;
    setTimeout(() => {
      if (lastTapRef.current !== now) {
        return;
      }
      onSingleTap();
      flashPauseIcon();
      lastTapRef.current = 0;
    }, 300);
  };

  return {showPauseIcon, showLikeBurst, handlePress};
}
