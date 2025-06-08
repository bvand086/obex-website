"use client";

import React, { useState, useEffect, useRef } from "react";

interface MousePosition {
  x: number;
  y: number;
}

const RotatingLinesGrid: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [horizontalSeparation] = useState(30);
  const [verticalSeparation] = useState(30);
  const [lineWidth] = useState(25);
  const [lineHeight] = useState(2);
  const [rows] = useState(10);
  const [columns] = useState(20);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
        setMousePosition({
          x: clientX - rect.left,
          y: clientY - rect.top
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove as EventListener);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove as EventListener);
    };
  }, []);

  const calculateRotationAndColor = (lineX: number, lineY: number) => {
    const dx = mousePosition.x - lineX;
    const dy = mousePosition.y - lineY;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return { angle, distance };
  };

  const getColor = (distance: number) => {
    const maxDistance = Math.sqrt(
      (containerRef.current?.clientWidth || 0) ** 2 + 
      (containerRef.current?.clientHeight || 0) ** 2
    ) || 500;
    const intensity = Math.max(0, 1 - distance / (maxDistance * 0.3));
    const r = Math.round(244 + (233 - 244) * intensity);
    const g = Math.round(162 + (196 - 162) * intensity);
    const b = Math.round(97 + (106 - 97) * intensity);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, ${lineWidth}px)`,
    gridTemplateRows: `repeat(${rows}, ${lineHeight}px)`,
    gap: `${verticalSeparation}px ${horizontalSeparation}px`,
    padding: '20px',
    backgroundColor: 'transparent',
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 0,
  };

  return (
    <div 
      ref={containerRef} 
      style={gridStyle}
      onTouchMove={(e) => e.preventDefault()}
    >
      {Array.from({ length: rows * columns }).map((_, index) => {
        const row = Math.floor(index / columns);
        const col = index % columns;
        const lineX = col * (lineWidth + horizontalSeparation) + lineWidth / 2;
        const lineY = row * (lineHeight + verticalSeparation) + lineHeight / 2;
        const rotationAndColor = calculateRotationAndColor(lineX, lineY);

        return (
          <div
            key={index}
            style={{
              width: `${lineWidth}px`,
              height: `${lineHeight}px`,
              backgroundColor: getColor(rotationAndColor.distance),
              transform: `rotate(${rotationAndColor.angle}deg)`,
              transformOrigin: 'center',
              transition: 'transform 0.1s ease-out, background-color 0.1s ease-out',
            }}
          />
        );
      })}
    </div>
  );
};

export default RotatingLinesGrid;