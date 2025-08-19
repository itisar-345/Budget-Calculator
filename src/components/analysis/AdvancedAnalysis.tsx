import React from 'react';
import { Shield, Clock, TrendingDown, AlertTriangle, Calculator, Target } from 'lucide-react';
import { BudgetAnalytics, BudgetData } from '../../types/budget';
import { formatCurrency, formatPercentage } from '../../lib/budgetCalculations';
import { MetricCard } from '../dashboard/MetricCard';
import { ProjectionChart } from '../charts/ProjectionChart';
import { FinancialHealthRadar } from '../charts/FinancialHealthRadar';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface AdvancedAnalysisProps {
  analytics: BudgetAnalytics;
  data: BudgetData;
}

export const AdvancedAnalysis: React.FC<AdvancedAnalysisProps> = ({ analytics, data }) => {
  const getCashFlowColor = (months: number) => {
    if (months >= 6) return 'success';
    if (months >= 3) return 'warning';
    return 'destructive';
  };

  const getVolatilityColor = (volatility: number) => {
    if (volatility < 20) return 'success';
    if (volatility < 40) return 'warning';
    return 'destructive';
  };

  const getSustainabilityColor = (months: number) => {
    if (months >= 6) return 'success';
    if (months >= 3) return 'warning';
    return 'destructive';
  };

  const getFinancialHealthScore = () => {
    let score = 0;
    
    // Savings rate (40 points max)
    if (analytics.savingsRate >= 20) score += 40;
    else if (analytics.savingsRate >= 15) score += 30;
    else if (analytics.savingsRate >= 10) score += 20;
    else if (analytics.savingsRate >= 5) score += 10;
    
    // Emergency fund (30 points max)
    if (analytics.cashFlowCushion >= 6) score += 30;
    else if (analytics.cashFlowCushion >= 3) score += 20;
    else if (analytics.cashFlowCushion >= 1) score += 10;
    
    // Income stability (20 points max)
    if (analytics.netIncome > 0) score += 20;
    else if (analytics.netIncome >= -analytics.totalIncome * 0.1) score += 10;
    
    // Expense management (10 points max)
    if (analytics.expenseVolatilityIndex < 20) score += 10;
    else if (analytics.expenseVolatilityIndex < 40) score += 5;
    
    return Math.min(100, score);
  };

  const healthScore = getFinancialHealthScore();

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'destructive';
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-8">
      {/* Financial Health Score */}
      <Card className="shadow-card border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            Financial Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={`hsl(var(--${getHealthScoreColor(healthScore)}))`}
                  strokeWidth="8"
                  strokeDasharray={`${(healthScore / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-foreground">{healthScore}</span>
                <span className="text-sm text-muted-foreground">/ 100</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-2">{getHealthScoreLabel(healthScore)}</h4>
            <p className="text-sm text-muted-foreground">
              Based on savings rate, emergency fund, income stability, and expense management
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Cash Flow Cushion"
          value={`${analytics.cashFlowCushion.toFixed(1)} months`}
          subtitle="Emergency fund coverage"
          icon={Shield}
          color={getCashFlowColor(analytics.cashFlowCushion)}
        />
        
        <MetricCard
          title="Expense Volatility"
          value={formatPercentage(analytics.expenseVolatilityIndex)}
          subtitle="Spending pattern stability"
          icon={TrendingDown}
          color={getVolatilityColor(analytics.expenseVolatilityIndex)}
        />
        
        <MetricCard
          title="Sustainability Period"
          value={`${analytics.sustainabilityMonths.toFixed(1)} months`}
          subtitle="How long savings would last"
          icon={Clock}
          color={getSustainabilityColor(analytics.sustainabilityMonths)}
        />
        

        
        <MetricCard
          title="Income Buffer"
          value={formatPercentage(analytics.totalIncome > 0 ? (analytics.totalIncome - analytics.breakEvenPoint) / analytics.totalIncome * 100 : 0)}
          subtitle="Income above break-even"
          icon={Calculator}
          color={analytics.totalIncome > 0 && (analytics.totalIncome - analytics.breakEvenPoint) / analytics.totalIncome >= 0.2 ? 'success' : 'warning'}
        />
        
        <MetricCard
          title="Break-Even Point"
          value={formatCurrency(analytics.breakEvenPoint)}
          subtitle="Minimum income required"
          icon={Target}
          color={analytics.breakEvenPoint < analytics.totalIncome ? 'success' : 'destructive'}
        />
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        {/* Future Projections */}
        <Card className="shadow-card border">
          <CardHeader>
            <CardTitle>Financial Projections</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectionChart data={data} />
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Projections account for {data.settings.inflationRate}% annual inflation rate. 
                Expenses are adjusted monthly while income remains constant.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Financial Health Radar */}
        <Card className="shadow-card border">
          <CardHeader>
            <CardTitle>Financial Health Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <FinancialHealthRadar analytics={analytics} />
          </CardContent>
        </Card>
      </div>

      {/* Financial Recommendations */}
      <Card className="shadow-card border">
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.savingsRate < 20 && (
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <h4 className="font-semibold text-warning mb-2">Increase Savings Rate</h4>
                <p className="text-sm text-muted-foreground">
                  Your current savings rate is {formatPercentage(analytics.savingsRate)}. 
                  Consider reducing variable expenses to reach the recommended 20% savings rate.
                </p>
              </div>
            )}
            
            {analytics.cashFlowCushion < 3 && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <h4 className="font-semibold text-destructive mb-2">Build Emergency Fund</h4>
                <p className="text-sm text-muted-foreground">
                  You have {analytics.cashFlowCushion.toFixed(1)} months of expenses saved. 
                  Build up to at least 3-6 months for financial security.
                </p>
              </div>
            )}
            
            {analytics.expenseVolatilityIndex > 30 && (
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <h4 className="font-semibold text-warning mb-2">Stabilize Spending</h4>
                <p className="text-sm text-muted-foreground">
                  Your expense volatility is {formatPercentage(analytics.expenseVolatilityIndex)}. 
                  Consider creating more consistent spending patterns for better budgeting.
                </p>
              </div>
            )}
            
            {analytics.netIncome < 0 && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <h4 className="font-semibold text-destructive mb-2">Address Deficit</h4>
                <p className="text-sm text-muted-foreground">
                  You have a monthly deficit of {formatCurrency(Math.abs(analytics.netIncome))}. 
                  Consider increasing income or reducing expenses immediately.
                </p>
              </div>
            )}
            

            
            {healthScore >= 80 && (
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <h4 className="font-semibold text-success mb-2">Excellent Financial Health!</h4>
                <p className="text-sm text-muted-foreground">
                  You're doing great! Consider exploring investment opportunities to grow your wealth further.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};