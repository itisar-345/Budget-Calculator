import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { BudgetData } from '../../types/budget';
import { BudgetCalculator } from '../../lib/budgetCalculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface VolatilityChartProps {
  data: BudgetData;
}

export const VolatilityChart: React.FC<VolatilityChartProps> = ({ data }) => {
  const calculator = new BudgetCalculator(data);
  const volatilityIndex = calculator.getExpenseVolatilityIndex();
  
  const chartData = {
    datasets: [
      {
        label: 'Expense Categories',
        data: data.expenses.map(expense => ({
          x: calculator.toMonthlyAmount(expense.budget, expense.frequency),
          y: volatilityIndex[expense.id] || 0,
          label: expense.name,
          color: expense.color,
        })),
        backgroundColor: data.expenses.map(expense => expense.color + '80'),
        borderColor: data.expenses.map(expense => expense.color),
        pointRadius: 8,
        pointHoverRadius: 10,
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
        text: 'Expense Volatility Analysis',
        color: 'hsl(var(--foreground))',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        backgroundColor: 'hsl(var(--card))',
        titleColor: 'hsl(var(--foreground))',
        bodyColor: 'hsl(var(--foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        callbacks: {
          title: function(context: any) {
            return context[0].raw.label;
          },
          label: function(context: any) {
            return [
              `Average Monthly: ₹${context.parsed.x.toLocaleString()}`,
              `Volatility Index: ${context.parsed.y.toFixed(1)}%`
            ];
          }
        },
      },
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        title: {
          display: true,
          text: 'Average Monthly Spending (₹)',
          color: 'hsl(var(--foreground))',
        },
        grid: {
          color: 'hsl(var(--border))',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          callback: function(value: any) {
            return '₹' + value.toLocaleString();
          }
        },
      },
      y: {
        title: {
          display: true,
          text: 'Volatility Index (%)',
          color: 'hsl(var(--foreground))',
        },
        grid: {
          color: 'hsl(var(--border))',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          callback: function(value: any) {
            return value.toFixed(1) + '%';
          }
        },
      },
    },
  };

  return (
    <div className="h-80 w-full">
      <Scatter data={chartData} options={options} />
    </div>
  );
};