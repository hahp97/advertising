import { RefObject, useEffect, useState } from 'react';

export interface MouseProps {
  x: number | null;
  y: number | null;
}

const useMouseXY = (elementRef: RefObject<HTMLElement>) => {
  const [coordinates, setCoordinates] = useState<MouseProps>({
    x: null,
    y: null,
  });

  const handleMouseMove = (e: MouseEvent) => {
    if (elementRef.current) {
      const postition = elementRef.current.getBoundingClientRect();
      const x = e.clientX - postition.left;
      const y = e.clientY - postition.top;
      setCoordinates({ x, y });
    }
  };

  useEffect(() => {
    const element = elementRef.current;

    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [elementRef]);

  return coordinates;
};

export default useMouseXY;
