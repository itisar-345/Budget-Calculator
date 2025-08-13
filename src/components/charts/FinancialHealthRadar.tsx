import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { BudgetAnalytics } from '../../types/budget';

interface FinancialHealthRadarProps {
  analytics: BudgetAnalytics;
}

export const FinancialHealthRadar: React.FC<FinancialHealthRadarProps> = ({ analytics }) => {
  const data = [
    { 
      metric: 'Savings Rate', 
      score: Math.min(Math.max(0, analytics.savingsRate), 100),
      display: `${Math.round(analytics.savingsRate)}%`
    },
    { 
      metric: 'Emergency Fund', 
      score: Math.min(Math.max(0, analytics.cashFlowCushion * 16.67), 100), // Scale 0-6 months to 0-100
      display: `${Math.round(analytics.cashFlowCushion * 10) / 10} months`
    },
    { 
      metric: 'Income Stability', 
      score: analytics.totalIncome > 0 ? Math.min(Math.max(0, (analytics.stableIncome / analytics.totalIncome) * 100), 100) : 0,
      display: `${Math.round(analytics.totalIncome > 0 ? (analytics.stableIncome / analytics.totalIncome) * 100 : 0)}%`
    },
    { 
      metric: 'Cash Flow Health', 
      score: analytics.netIncome >= 0 ? Math.min((analytics.netIncome / Math.max(analytics.totalIncome, 1)) * 100, 100) : 0,
      display: analytics.netIncome >= 0 ? 'Positive' : 'Deficit'
    },
    { 
      metric: 'Expense Control', 
      score: Math.max(0, Math.min(100, 100 - analytics.expenseVolatilityIndex)),
      display: `${Math.round(Math.max(0, 100 - analytics.expenseVolatilityIndex))}%`
    },
    { 
      metric: 'Financial Stability', 
      score: Math.max(0, Math.min(100, (analytics.stableIncome / Math.max(analytics.totalIncome, 1)) * 100)),
      display: `${Math.round((analytics.stableIncome / Math.max(analytics.totalIncome, 1)) * 100)}%`
    },
  ];

  const getHealthLevel = (score: number) => {
    if (score >= 80) return { level: 'Excellent', color: '#10B981' };
    if (score >= 60) return { level: 'Good', color: '#F59E0B' };
    if (score >= 40) return { level: 'Fair', color: '#EF4444' };
    return { level: 'Needs Improvement', color: '#DC2626' };
  };

  const averageScore = data.reduce((sum, item) => sum + item.score, 0) / data.length;
  const healthStatus = getHealthLevel(averageScore);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/90 border-2 border-black rounded-lg p-3 shadow-lg">
          <p className="font-medium text-black">{data.metric}</p>
          <p className="text-sm text-gray-700">
            Value: {data.display}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: '#374151' }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#6B7280' }} tickCount={5} />
            <Radar
              name="Financial Health"
              dataKey="score"
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.3}
              strokeWidth={2}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};