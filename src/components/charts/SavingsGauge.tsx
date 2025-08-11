import React from 'react';
import { formatPercentage } from '../../lib/budgetCalculations';

interface SavingsGaugeProps {
  savingsRate: number;
  target?: number;
}

export const SavingsGauge: React.FC<SavingsGaugeProps> = ({ 
  savingsRate, 
  target = 20 
}) => {
  const normalizedRate = Math.max(0, Math.min(100, savingsRate));
  const normalizedTarget = Math.max(0, Math.min(100, target));
  
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (normalizedRate / 100) * circumference;
  const targetOffset = circumference - (normalizedTarget / 100) * circumference;

  const getColor = (rate: number) => {
    if (rate >= 20) return 'hsl(var(--success))';
    if (rate >= 10) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

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
          strokeDasharray={`2 ${circumference - 2}`}
          strokeDashoffset={targetOffset}
          opacity="0.5"
        />
        
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={getColor(normalizedRate)}
          strokeWidth="8"
          strokeDasharray={strokeDasharray}
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