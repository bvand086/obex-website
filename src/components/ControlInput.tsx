"use client";

import React, { useState, useEffect, useRef } from "react";

interface ControlInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

const ControlInput: React.FC<ControlInputProps> = ({ label, value, onChange, min, max }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startValueRef = useRef<number>(value);

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
    startValueRef.current = value;
  };

  const handleMove = (clientX: number) => {
    if (isDragging) {
      const sensitivity = 0.5;
      const delta = (clientX - startXRef.current) * sensitivity;
      const range = max - min;
      const newValue = Math.round(startValueRef.current + (delta / 100) * range);
      onChange(Math.max(min, Math.min(max, newValue)));
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const handleMouseUp = handleEnd;
    const handleTouchEnd = handleEnd;

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, min, max, onChange]);

  return (
    <div className="flex items-center mr-4 mb-2">
      <label className="mr-2 text-gray-500 font-mono text-xs">{label}</label>
      <div
        ref={inputRef}
        className={`w-12 text-center py-1 text-gray-500 font-mono text-xs cursor-ew-resize select-none ${
          isDragging ? 'text-white' : ''
        }`}
        onMouseDown={(e) => handleStart(e.clientX)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      >
        {value}
      </div>
    </div>
  );
};

export default ControlInput;