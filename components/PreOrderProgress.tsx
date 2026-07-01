"use client";

import { useEffect, useState } from "react";
import { Clock, TrendingUp } from "lucide-react";

type PreOrderProgressProps = {
  endDate?: Date | null;
  quota?: number | null;
  sold: number;
};

export default function PreOrderProgress({ endDate, quota, sold }: PreOrderProgressProps) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    if (!endDate) return;
    
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          d: Math.floor(difference / (1000 * 60 * 60 * 24)),
          h: Math.floor((difference / (1000 * 60 * 60)) % 24),
          m: Math.floor((difference / 1000 / 60) % 60),
          s: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft(null); // Ended
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  const percentage = quota ? Math.min(100, Math.round((sold / quota) * 100)) : 0;

  return (
    <div className="mt-6 border border-burgundy/20 bg-cream p-4">
      {/* Quota Progress Bar */}
      {quota && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-burgundy">
              <TrendingUp className="w-3.5 h-3.5" />
              Pre-Order Quota
            </span>
            <span className="text-xs font-medium text-muted">
              <span className="text-burgundy font-bold">{sold}</span> / {quota} Sold
            </span>
          </div>
          <div className="h-2 w-full bg-burgundy/10 overflow-hidden">
            <div 
              className="h-full bg-burgundy transition-all duration-1000" 
              style={{ width: `${percentage}%` }}
            />
          </div>
          {percentage >= 80 && percentage < 100 && (
            <p className="mt-1.5 text-[10px] uppercase font-bold text-red-600 tracking-wider">
              Almost Sold Out!
            </p>
          )}
        </div>
      )}

      {/* Countdown Timer */}
      {endDate && (
        <div>
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-burgundy mb-2">
            <Clock className="w-3.5 h-3.5" />
            Pre-Order Ends In
          </span>
          {timeLeft ? (
            <div className="flex gap-2">
              <div className="flex-1 bg-white border border-burgundy/10 py-2 flex flex-col items-center justify-center">
                <span className="font-serif text-xl font-semibold text-ink leading-none">{timeLeft.d}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted mt-1">Days</span>
              </div>
              <div className="flex-1 bg-white border border-burgundy/10 py-2 flex flex-col items-center justify-center">
                <span className="font-serif text-xl font-semibold text-ink leading-none">{timeLeft.h}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted mt-1">Hours</span>
              </div>
              <div className="flex-1 bg-white border border-burgundy/10 py-2 flex flex-col items-center justify-center">
                <span className="font-serif text-xl font-semibold text-ink leading-none">{timeLeft.m}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted mt-1">Mins</span>
              </div>
              <div className="flex-1 bg-white border border-burgundy/10 py-2 flex flex-col items-center justify-center">
                <span className="font-serif text-xl font-semibold text-ink leading-none">{timeLeft.s}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted mt-1">Secs</span>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 py-3 flex items-center justify-center">
              <span className="font-semibold uppercase tracking-wider text-red-600 text-sm">
                Pre-Order Closed
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
