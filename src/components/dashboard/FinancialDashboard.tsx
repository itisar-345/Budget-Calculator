import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Target, Shield, Clock } from 'lucide-react';
import { BudgetAnalytics } from '../../types/budget';
import { formatCurrency, formatPercentage } from '../../lib/budgetCalculations';
import { MetricCard } from './MetricCard';
import { OverviewChart } from '../charts/OverviewChart';
import { SavingsGauge } from '../charts/SavingsGauge';

interface FinancialDashboardProps {
  analytics: BudgetAnalytics;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ analytics }) => {
  const getSavingsColor = (rate: number) => {
    if (rate >= 20) return 'success';
    if (rate >= 10) return 'warning';
    return 'destructive';
  };

  const getCashFlowColor = (months: number) => {
    if (months >= 6) return 'success';
    if (months >= 3) return 'warning';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Monthly Income"
          value={formatCurrency(analytics.totalIncome)}
          subtitle="Total monthly income from all sources"
          icon={DollarSign}
          color="success"
        />
        
        <MetricCard
          title="Monthly Expenses"
          value={formatCurrency(analytics.totalExpenses)}
          subtitle="Total monthly expenses across all categories"
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
          subtitle="Percentage of income saved monthly"
          icon={Target}
          color={getSavingsColor(analytics.savingsRate)}
        />
        
        <MetricCard
          title="Cash Flow Cushion"
          value={`${analytics.cashFlowCushion.toFixed(1)} months`}
          subtitle="Emergency fund coverage"
          icon={Shield}
          color={getCashFlowColor(analytics.cashFlowCushion)}
        />
        
        <MetricCard
          title="Break-Even Point"
          value={formatCurrency(analytics.breakEvenPoint)}
          subtitle="Minimum income needed to cover expenses"
          icon={Clock}
        />
      </div>

      {/* Charts Section */}
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

      {/* Advanced Metrics */}
      <div className="bg-card rounded-lg p-6 shadow-card border">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Advanced Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-accent">
              {formatPercentage(analytics.expenseVolatilityIndex)}
            </div>
            <div className="text-sm text-muted-foreground">
              Expense Volatility
            </div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-accent">
              {analytics.sustainabilityMonths.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">
              Sustainability (months)
            </div>
          </div>
          
          {analytics.debtBurnRate && (
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-accent">
                {analytics.debtBurnRate.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                Debt Burn Rate (months)
              </div>
            </div>
          )}
          
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