
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NumberPadProps {
  onNumberClick: (number: number) => void;
  onDeleteClick: () => void;
  className?: string;
}

const NumberPad: React.FC<NumberPadProps> = ({ 
  onNumberClick, 
  onDeleteClick,
  className 
}) => {
  // Function to handle number clicks with the swapping logic
  const handleNumberClick = (number: number) => {
    // Input the actual number clicked
    onNumberClick(number);
  };

  return (
    <div className={cn("number-pad", className)}>
      {[1, 2, 3, 4, 5, 6].map((number) => (
        <Button
          key={number}
          onClick={() => handleNumberClick(number)}
          className={cn(
            "number-button bg-dice-" + number,
            "hover:bg-opacity-90 text-white"
          )}
          variant="ghost"
        >
          {number}
        </Button>
      ))}
      <Button
        onClick={onDeleteClick}
        className="number-button col-span-3 bg-secondary hover:bg-secondary/80 text-white"
        variant="ghost"
      >
        Hapus
      </Button>
    </div>
  );
};

export default NumberPad;
