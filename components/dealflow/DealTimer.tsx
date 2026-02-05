import React, { useState, useEffect } from 'react';
import { getTimeRemaining } from './types';
import { cn } from '../../utils/cn';
import { Clock, AlertTriangle } from 'lucide-react';

interface DealTimerProps {
  deadline: Date;
  className?: string;
}

export const DealTimer: React.FC<DealTimerProps> = ({ deadline, className }) => {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(deadline));
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  const { hours, minutes, seconds, expired } = timeRemaining;
  const isUrgent = hours < 6 && !expired;
  const isCritical = hours < 2 && !expired;

  if (expired) {
    return (
      <div className={cn('flex items-center gap-1.5 text-red-600 font-medium text-sm', className)}>
        <AlertTriangle size={14} />
        <span>Payment deadline expired</span>
      </div>
    );
  }

  const formatTime = () => {
    const h = String(hours).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    const s = String(seconds).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-sm font-mono',
        isCritical ? 'text-red-600 font-bold' : isUrgent ? 'text-orange-600 font-semibold' : 'text-slate-600',
        className
      )}
    >
      <Clock size={14} className={isCritical ? 'animate-pulse' : ''} />
      <span>{formatTime()} remaining</span>
    </div>
  );
};

export default DealTimer;
