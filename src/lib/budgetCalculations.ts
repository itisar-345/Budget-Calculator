import { BudgetData, BudgetAnalytics, IncomeSource, ExpenseCategory, MonthlyData } from '../types/budget';

export class BudgetCalculator {
  private data: BudgetData;

  constructor(data: BudgetData) {
    this.data = data;
  }

  // Convert any frequency to monthly amount
  public toMonthlyAmount(amount: number, frequency: string): number {
    switch (frequency) {
      case 'weekly': return amount * 4.33;
      case 'biweekly': return amount * 2.17;
      case 'yearly': return amount / 12;
      case 'one-time': return amount;
      default: return amount; // monthly
    }
  }

  // Calculate total monthly income
  getTotalMonthlyIncome(): number {
    return this.data.incomes.reduce((total, income) => {
      return total + this.toMonthlyAmount(income.amount, income.frequency);
    }, 0);
  }

  // Calculate total monthly expenses
  getTotalMonthlyExpenses(): number {
    return this.data.expenses.reduce((total, expense) => {
      return total + this.toMonthlyAmount(expense.budget, expense.frequency);
    }, 0);
  }

  // Calculate break-even point
  getBreakEvenPoint(): number {
    const fixedExpenses = this.data.expenses
      .filter(exp => exp.type === 'fixed')
      .reduce((total, exp) => total + this.toMonthlyAmount(exp.budget, exp.frequency), 0);

    const avgVariableExpenses = this.data.expenses
      .filter(exp => exp.type === 'variable')
      .reduce((total, exp) => total + this.toMonthlyAmount(exp.budget, exp.frequency), 0);

    return fixedExpenses + avgVariableExpenses;
  }

  // Calculate expense volatility index for each category
  getExpenseVolatilityIndex(): Record<string, number> {
    const volatilityIndex: Record<string, number> = {};

    this.data.expenses.forEach(category => {
      const monthlySpending = this.data.monthlyHistory.map(month => 
        month.categories[category.id] || 0
      );

      if (monthlySpending.length < 2) {
        volatilityIndex[category.id] = 0;
        return;
      }

      const mean = monthlySpending.reduce((sum, val) => sum + val, 0) / monthlySpending.length;
      const variance = monthlySpending.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / monthlySpending.length;
      const standardDeviation = Math.sqrt(variance);

      volatilityIndex[category.id] = mean > 0 ? (standardDeviation / mean) * 100 : 0;
    });

    return volatilityIndex;
  }

  // Calculate savings sustainability (how long current savings would last with zero income)
  getSavingsSustainability(): number {
    const currentSavings = this.data.goals
      .filter(goal => goal.type === 'savings')
      .reduce((total, goal) => total + goal.currentAmount, 0);

    const monthlyExpenses = this.getTotalMonthlyExpenses();
    
    return monthlyExpenses > 0 ? currentSavings / monthlyExpenses : 0;
  }

  // Calculate cash flow cushion
  getCashFlowCushion(): number {
    const liquidAssets = this.data.goals
      .filter(goal => goal.type === 'savings')
      .reduce((total, goal) => total + goal.currentAmount, 0);

    const monthlyExpenses = this.getTotalMonthlyExpenses();
    
    return monthlyExpenses > 0 ? liquidAssets / monthlyExpenses : 0;
  }

  // Calculate debt burn rate
  getDebtBurnRate(): number {
    const totalDebt = this.data.goals
      .filter(goal => goal.type === 'debt')
      .reduce((total, goal) => total + (goal.targetAmount - goal.currentAmount), 0);

    const monthlyIncome = this.getTotalMonthlyIncome();
    const monthlyExpenses = this.getTotalMonthlyExpenses();
    const surplus = monthlyIncome - monthlyExpenses;

    if (surplus <= 0 || totalDebt <= 0) return 0;

    return totalDebt / surplus;
  }

  // Calculate inflation-adjusted projections
  getInflationAdjustedProjection(months: number): MonthlyData[] {
    const inflationRate = this.data.settings.inflationRate / 100 / 12; // Monthly inflation
    const projections: MonthlyData[] = [];

    for (let i = 1; i <= months; i++) {
      const inflationMultiplier = Math.pow(1 + inflationRate, i);
      const adjustedExpenses = this.getTotalMonthlyExpenses() * inflationMultiplier;
      const currentIncome = this.getTotalMonthlyIncome();

      projections.push({
        month: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 7),
        income: currentIncome,
        expenses: adjustedExpenses,
        surplus: currentIncome - adjustedExpenses,
        savings: Math.max(0, currentIncome - adjustedExpenses),
        categories: {}
      });
    }

    return projections;
  }

  // Generate comprehensive analytics
  getAnalytics(): BudgetAnalytics {
    const totalIncome = this.getTotalMonthlyIncome();
    const totalExpenses = this.getTotalMonthlyExpenses();
    const netIncome = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      netIncome,
      savingsRate,
      breakEvenPoint: this.getBreakEvenPoint(),
      expenseVolatilityIndex: Object.values(this.getExpenseVolatilityIndex()).reduce((sum, val) => sum + val, 0) / this.data.expenses.length,
      cashFlowCushion: this.getCashFlowCushion(),
      debtBurnRate: this.getDebtBurnRate(),
      sustainabilityMonths: this.getSavingsSustainability()
    };
  }
}

// Utility functions
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getHealthColor = (value: number, thresholds: { good: number; warning: number }): string => {
  if (value >= thresholds.good) return 'hsl(var(--success))';
  if (value >= thresholds.warning) return 'hsl(var(--warning))';
  return 'hsl(var(--destructive))';
};