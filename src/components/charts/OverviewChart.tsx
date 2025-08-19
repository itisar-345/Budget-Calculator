import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BudgetAnalytics } from '../../types/budget';
import { formatCurrency } from '../../lib/budgetCalculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface OverviewChartProps {
  analytics: BudgetAnalytics;
}

export const OverviewChart: React.FC<OverviewChartProps> = ({ analytics }) => {
  const { data, options } = useMemo(() => {
    const data = {
    labels: ['Income', 'Expenses', 'Net Income'],
    datasets: [
      {
        label: 'Monthly Amount',
        data: [analytics.totalIncome, analytics.totalExpenses, analytics.netIncome],
        backgroundColor: [
          '#10B981',
          '#EF4444', 
          analytics.netIncome >= 0 ? '#8B5CF6' : '#F59E0B',
        ],
        borderColor: [
          '#059669',
          '#DC2626',
          analytics.netIncome >= 0 ? '#7C3AED' : '#D97706',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Monthly Financial Overview',
        color: 'hsl(var(--foreground))',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: { parsed: { y: number } }) {
            return formatCurrency(context.parsed.y);
          }
        },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000000',
        bodyColor: '#1F2937',
        borderColor: '#000000',
        borderWidth: 2,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'hsl(var(--border))',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          callback: function(value: number | string) {
            return formatCurrency(Number(value));
          }
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        },
      },
    },
    };

    return { data, options };
  }, [analytics]);

  return (
    <div className="h-64 w-full">
      <Bar data={data} options={options} />
    </div>
  );
};