import { useEffect, useRef, useState } from 'react';

export function useCountUp(targetValue, duration = 600) {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const previousValue = useRef(targetValue);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = previousValue.current;
    const end = targetValue;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(start + (end - start) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(update);
      } else {
        previousValue.current = end;
      }
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(update);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetValue, duration]);

  return displayValue;
}
