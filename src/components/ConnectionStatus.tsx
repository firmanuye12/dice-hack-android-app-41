
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  className?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // For demo purposes - simulate connection changes
    const interval = setInterval(() => {
      setIsConnected(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn(
      "flex items-center justify-center p-3 rounded-lg bg-secondary/50 backdrop-blur-sm", 
      className
    )}>
      <div className={cn(
        "status-indicator animate-status-pulse",
        isConnected ? "bg-green-500" : "bg-red-500"
      )}></div>
      <span className="text-sm font-medium">
        {isConnected ? "Terhubung" : "Tidak Terhubung"}
      </span>
    </div>
  );
};

export default ConnectionStatus;
