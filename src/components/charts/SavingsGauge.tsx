import React, { useMemo } from 'react';
import { formatPercentage } from '../../lib/budgetCalculations';

interface SavingsGaugeProps {
  savingsRate: number;
  target?: number;
}

const CIRCUMFERENCE = 2 * Math.PI * 45;

const getColor = (rate: number) => {
  if (rate < 0) return '#DC2626';
  if (rate >= 20) return '#10B981';
  if (rate >= 10) return '#F59E0B';
  return '#EF4444';
};

export const SavingsGauge: React.FC<SavingsGaugeProps> = ({ 
  savingsRate, 
  target = 20 
}) => {
  const { normalizedRate, normalizedTarget, strokeDashoffset, targetOffset } = useMemo(() => {
    const normalizedRate = Math.max(0, Math.min(100, Math.abs(savingsRate)));
    const normalizedTarget = Math.max(0, Math.min(100, target));
    const strokeDashoffset = CIRCUMFERENCE - (normalizedRate / 100) * CIRCUMFERENCE;
    const targetOffset = CIRCUMFERENCE - (normalizedTarget / 100) * CIRCUMFERENCE;
    return { normalizedRate, normalizedTarget, strokeDashoffset, targetOffset };
  }, [savingsRate, target]);

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
        />
        
        {/* Target indicator */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="2"
          strokeDasharray={`2 ${CIRCUMFERENCE - 2}`}
          strokeDashoffset={targetOffset}
          opacity="0.5"
        />
        
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={getColor(savingsRate)}
          strokeWidth="8"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">
          {formatPercentage(savingsRate)}
        </span>
        <span className="text-sm text-muted-foreground">
          Savings Rate
        </span>
      </div>
    </div>
  );
};