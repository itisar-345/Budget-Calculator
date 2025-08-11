import React from 'react';
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
  const data = {
    labels: ['Income', 'Expenses', 'Net Income'],
    datasets: [
      {
        label: 'Monthly Amount',
        data: [analytics.totalIncome, analytics.totalExpenses, analytics.netIncome],
        backgroundColor: [
          'hsl(var(--success) / 0.8)',
          'hsl(var(--destructive) / 0.8)',
          analytics.netIncome >= 0 ? 'hsl(var(--accent) / 0.8)' : 'hsl(var(--warning) / 0.8)',
        ],
        borderColor: [
          'hsl(var(--success))',
          'hsl(var(--destructive))',
          analytics.netIncome >= 0 ? 'hsl(var(--accent))' : 'hsl(var(--warning))',
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
          label: function(context: any) {
            return formatCurrency(context.parsed.y);
          }
        },
        backgroundColor: 'hsl(var(--card))',
        titleColor: 'hsl(var(--foreground))',
        bodyColor: 'hsl(var(--foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
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
          callback: function(value: any) {
            return formatCurrency(value);
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

  return (
    <div className="h-64 w-full">
      <Bar data={data} options={options} />
    </div>
  );
};