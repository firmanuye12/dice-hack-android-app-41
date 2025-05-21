
import React from 'react';
import { cn } from '@/lib/utils';
import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusProps {
  className?: string;
  isConnected: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  className,
  isConnected 
}) => {
  return (
    <div className={cn(
      "flex items-center justify-center p-3 rounded-lg backdrop-blur-sm gap-2", 
      isConnected ? "bg-green-500/20" : "bg-red-500/20",
      className
    )}>
      <div className={cn(
        "h-3 w-3 rounded-full animate-pulse",
        isConnected ? "bg-green-500" : "bg-red-500"
      )}></div>
      {isConnected ? (
        <>
          <Wifi size={18} className="text-green-500" />
          <span className="text-sm font-medium text-green-500">Terhubung ke APK Dadu</span>
        </>
      ) : (
        <>
          <WifiOff size={18} className="text-red-500" />
          <span className="text-sm font-medium text-red-500">Tidak Terhubung ke APK Dadu</span>
        </>
      )}
    </div>
  );
};

export default ConnectionStatus;
