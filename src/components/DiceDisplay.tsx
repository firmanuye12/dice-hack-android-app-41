
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DiceDisplayProps {
  value: number;
  onRollComplete?: () => void;
}

const DiceDisplay: React.FC<DiceDisplayProps> = ({ value, onRollComplete }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    if (value !== currentValue) {
      setIsRolling(true);
      const timer = setTimeout(() => {
        setCurrentValue(value);
        setIsRolling(false);
        if (onRollComplete) onRollComplete();
      }, 800); // Match the animation duration
      return () => clearTimeout(timer);
    }
  }, [value, currentValue, onRollComplete]);

  const diceBgColors = {
    1: 'bg-dice-1',
    2: 'bg-dice-2',
    3: 'bg-dice-3',
    4: 'bg-dice-4',
    5: 'bg-dice-5',
    6: 'bg-dice-6',
  };

  return (
    <div className="perspective-500 w-24 h-24 relative mx-auto my-6">
      <div 
        className={cn(
          "w-full h-full relative transition-transform duration-800 preserve-3d",
          isRolling && "animate-dice-roll"
        )}
      >
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div 
            key={num}
            className={cn(
              "dice-face", 
              diceBgColors[num as keyof typeof diceBgColors],
              num === 1 && "transform-style-3d rotateY(0deg)",
              num === 2 && "transform-style-3d rotateY(90deg)",
              num === 3 && "transform-style-3d rotateX(90deg)",
              num === 4 && "transform-style-3d rotateX(-90deg)",
              num === 5 && "transform-style-3d rotateY(-90deg)",
              num === 6 && "transform-style-3d rotateY(180deg)",
            )}
          >
            {num}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl font-bold text-white">{currentValue}</span>
      </div>
    </div>
  );
};

export default DiceDisplay;
