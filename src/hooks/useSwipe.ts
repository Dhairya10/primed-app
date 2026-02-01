import { useRef } from 'react';

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  minSwipeDistance?: number;
  preventScrollOnSwipe?: boolean;
}

interface SwipeHandlers {
  onTouchStart: (event: React.TouchEvent) => void;
  onTouchMove: (event: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  minSwipeDistance = 50,
  preventScrollOnSwipe = false,
}: SwipeConfig): SwipeHandlers {
  const touchStart = useRef({ x: 0, y: 0, time: 0 });
  const touchCurrent = useRef({ x: 0, y: 0 });

  const onTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    touchCurrent.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchMove = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchCurrent.current = { x: touch.clientX, y: touch.clientY };

    if (preventScrollOnSwipe && Math.abs(touch.clientX - touchStart.current.x) > Math.abs(touch.clientY - touchStart.current.y)) {
      event.preventDefault();
    }
  };

  const onTouchEnd = () => {
    const deltaX = touchStart.current.x - touchCurrent.current.x;
    const deltaY = Math.abs(touchStart.current.y - touchCurrent.current.y);
    const elapsed = Date.now() - touchStart.current.time;

    if (elapsed > 600) {
      return;
    }

    if (Math.abs(deltaX) <= deltaY) {
      return;
    }

    if (deltaX > minSwipeDistance) {
      onSwipeLeft?.();
    } else if (deltaX < -minSwipeDistance) {
      onSwipeRight?.();
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
