import React from 'react';
import { IndianRupee, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { BudgetAnalytics } from '../../types/budget';
import { formatCurrency, formatPercentage } from '../../lib/budgetCalculations';
import { MetricCard } from './MetricCard';
import { OverviewChart } from '../charts/OverviewChart';
import { SavingsGauge } from '../charts/SavingsGauge';

interface QuickOverviewProps {
  analytics: BudgetAnalytics;
}

export const QuickOverview: React.FC<QuickOverviewProps> = ({ analytics }) => {
  const getSavingsColor = (rate: number) => {
    if (rate >= 20) return 'success';
    if (rate >= 10) return 'warning';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid - Simplified for Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Monthly Income"
          value={formatCurrency(analytics.totalIncome)}
          subtitle="Total monthly income"
          icon={IndianRupee}
          color="success"
        />
        
        <MetricCard
          title="Monthly Expenses"
          value={formatCurrency(analytics.totalExpenses)}
          subtitle="Total monthly expenses"
          icon={TrendingDown}
          color="destructive"
        />
        
        <MetricCard
          title="Net Income"
          value={formatCurrency(analytics.netIncome)}
          subtitle={analytics.netIncome >= 0 ? 'Monthly surplus' : 'Monthly deficit'}
          icon={analytics.netIncome >= 0 ? TrendingUp : TrendingDown}
          color={analytics.netIncome >= 0 ? 'success' : 'destructive'}
        />
        
        <MetricCard
          title="Savings Rate"
          value={formatPercentage(analytics.savingsRate)}
          subtitle="Percentage of income saved"
          icon={Target}
          color={getSavingsColor(analytics.savingsRate)}
        />
      </div>

      {/* Charts Section - Simplified */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Overview Chart */}
        <div className="bg-card rounded-lg p-6 shadow-card border">
          <OverviewChart analytics={analytics} />
        </div>

        {/* Savings Rate Gauge */}
        <div className="bg-card rounded-lg p-6 shadow-card border">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Savings Performance</h3>
          <SavingsGauge savingsRate={analytics.savingsRate} target={20} />
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Target: 20% savings rate for optimal financial health
            </p>
          </div>
        </div>
      </div>

      {/* Quick Financial Health Summary */}
      <div className="bg-card rounded-lg p-6 shadow-card border">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Financial Health Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-accent">
              {formatCurrency(analytics.breakEvenPoint)}
            </div>
            <div className="text-sm text-muted-foreground">
              Break-Even Point
            </div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-accent">
              {analytics.cashFlowCushion.toFixed(1)} months
            </div>
            <div className="text-sm text-muted-foreground">
              Emergency Fund
            </div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-accent">
              {((analytics.totalIncome - analytics.breakEvenPoint) / analytics.totalIncome * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Income Buffer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};