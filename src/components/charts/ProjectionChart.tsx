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
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { BudgetCalculator } from '../../lib/budgetCalculations';
import { BudgetData } from '../../types/budget';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ProjectionChartProps {
  data: BudgetData;
}

export const ProjectionChart: React.FC<ProjectionChartProps> = ({ data }) => {
  const calculator = new BudgetCalculator(data);
  const projections = calculator.getInflationAdjustedProjection(12);
  
  const chartData = {
    labels: projections.map(p => new Date(p.month).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })),
    datasets: [
      {
        label: 'Income',
        data: projections.map(p => p.income),
        borderColor: 'hsl(var(--success))',
        backgroundColor: 'hsl(var(--success) / 0.1)',
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Expenses (Inflation Adjusted)',
        data: projections.map(p => p.expenses),
        borderColor: 'hsl(var(--destructive))',
        backgroundColor: 'hsl(var(--destructive) / 0.1)',
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Net Income',
        data: projections.map(p => p.surplus),
        borderColor: 'hsl(var(--accent))',
        backgroundColor: 'hsl(var(--accent) / 0.2)',
        fill: 'origin',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'hsl(var(--foreground))',
        },
      },
      title: {
        display: true,
        text: '12-Month Financial Projection (Inflation Adjusted)',
        color: 'hsl(var(--foreground))',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'hsl(var(--card))',
        titleColor: 'hsl(var(--foreground))',
        bodyColor: 'hsl(var(--foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
          }
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'hsl(var(--border))',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        },
      },
      y: {
        display: true,
        grid: {
          color: 'hsl(var(--border))',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        },
      },
    },
  };

  return (
    <div className="h-80 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
};