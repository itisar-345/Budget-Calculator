import { BudgetData, BudgetAnalytics, IncomeSource, ExpenseCategory, MonthlyData } from '../types/budget';

export class BudgetCalculator {
  private data: BudgetData;
  private currentDate: Date;

  constructor(data: BudgetData, currentDate?: Date) {
    this.data = data;
    this.currentDate = currentDate || new Date();
  }

  // Convert any frequency to monthly amount
  public toMonthlyAmount(amount: number, frequency: string): number {
    switch (frequency) {
      case 'weekly': return amount * 4.33; // 52 weeks / 12 months
      case 'biweekly': return amount * 2.17; // 26 biweeks / 12 months
      case 'yearly': return amount / 12;
      case 'one-time': return 0; // One-time amounts don't contribute to monthly recurring
      default: return amount; // monthly
    }
  }

  // Calculate total monthly income (considering dates)
  getTotalMonthlyIncome(): number {
    return this.data.incomes
      .filter(income => {
        // Handle incomes without dates (legacy data)
        if (!income.startDate) return income.isRecurring || income.frequency !== 'one-time';
        
        const startDate = new Date(income.startDate);
        const endDate = income.endDate ? new Date(income.endDate) : null;
        const isActive = startDate <= this.currentDate && (!endDate || endDate >= this.currentDate);
        return isActive && (income.isRecurring || income.frequency !== 'one-time');
      })
      .reduce((total, income) => {
        return total + this.toMonthlyAmount(income.amount, income.frequency);
      }, 0);
  }

  // Calculate total monthly expenses (considering dates)
  getTotalMonthlyExpenses(): number {
    return this.data.expenses
      .filter(expense => {
        // Handle expenses without dates (legacy data)
        if (!expense.startDate) return true;
        
        const startDate = new Date(expense.startDate);
        const endDate = expense.endDate ? new Date(expense.endDate) : null;
        return startDate <= this.currentDate && (!endDate || endDate >= this.currentDate);
      })
      .reduce((total, expense) => {
        return total + this.toMonthlyAmount(expense.budget, expense.frequency);
      }, 0);
  }

  // Calculate break-even point (considering active expenses only)
  getBreakEvenPoint(): number {
    const currentDate = new Date();
    const activeExpenses = this.data.expenses.filter(expense => {
      // Handle expenses without dates (legacy data)
      if (!expense.startDate) return true;
      
      const startDate = new Date(expense.startDate);
      const endDate = expense.endDate ? new Date(expense.endDate) : null;
      return startDate <= currentDate && (!endDate || endDate >= currentDate);
    });

    const fixedExpenses = activeExpenses
      .filter(exp => exp.type === 'fixed')
      .reduce((total, exp) => total + this.toMonthlyAmount(exp.budget, exp.frequency), 0);

    const avgVariableExpenses = activeExpenses
      .filter(exp => exp.type === 'variable')
      .reduce((total, exp) => total + this.toMonthlyAmount(exp.budget, exp.frequency), 0);

    return fixedExpenses + avgVariableExpenses;
  }

  // Calculate expense volatility index for each category
  getExpenseVolatilityIndex(): Record<string, number> {
    const volatilityIndex: Record<string, number> = {};

    if (this.data.monthlyHistory.length < 2) {
      // If no historical data, return low volatility for fixed expenses, higher for variable
      this.data.expenses.forEach(category => {
        volatilityIndex[category.id] = category.type === 'fixed' ? 5 : category.type === 'variable' ? 25 : 40;
      });
      return volatilityIndex;
    }

    this.data.expenses.forEach(category => {
      const monthlySpending = this.data.monthlyHistory.map(month => 
        month.categories[category.id] || 0
      );

      if (monthlySpending.length < 2) {
        volatilityIndex[category.id] = category.type === 'fixed' ? 5 : category.type === 'variable' ? 25 : 40;
        return;
      }

      const mean = monthlySpending.reduce((sum, val) => sum + val, 0) / monthlySpending.length;
      const variance = monthlySpending.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / monthlySpending.length;
      const standardDeviation = Math.sqrt(variance);

      volatilityIndex[category.id] = mean > 0 ? (standardDeviation / mean) * 100 : 0;
    });

    return volatilityIndex;
  }

  // Calculate total savings from monthly records
  getTotalSavings(): number {
    return this.data.monthlySavings.reduce((total, savings) => total + savings.amount, 0);
  }

  // Calculate average monthly savings
  getAverageMonthlySavings(): number {
    if (this.data.monthlySavings.length === 0) return 0;
    return this.getTotalSavings() / this.data.monthlySavings.length;
  }

  // Calculate savings sustainability (how long all savings + net income would last)
  getSavingsSustainability(): number {
    const totalSavings = this.getTotalSavings();
    const netIncome = this.getTotalMonthlyIncome() - this.getTotalMonthlyExpenses();
    const monthlyExpenses = this.getTotalMonthlyExpenses();
    
    if (monthlyExpenses <= 0) return 0;
    
    // If net income is positive, savings last longer
    if (netIncome > 0) {
      return totalSavings / Math.max(monthlyExpenses - netIncome, monthlyExpenses * 0.1);
    }
    
    // If net income is negative, savings deplete faster
    return totalSavings / (monthlyExpenses + Math.abs(netIncome));
  }

  // Calculate cash flow cushion (emergency fund coverage)
  getCashFlowCushion(): number {
    const totalSavings = this.getTotalSavings();
    const essentialExpenses = this.data.expenses
      .filter(expense => {
        // Handle expenses without dates (legacy data)
        if (!expense.startDate) return expense.type === 'fixed';
        
        const currentDate = new Date();
        const startDate = new Date(expense.startDate);
        const endDate = expense.endDate ? new Date(expense.endDate) : null;
        const isActive = startDate <= currentDate && (!endDate || endDate >= currentDate);
        return isActive && expense.type === 'fixed';
      })
      .reduce((total, expense) => {
        return total + this.toMonthlyAmount(expense.budget, expense.frequency);
      }, 0);
    
    return essentialExpenses > 0 ? totalSavings / essentialExpenses : 0;
  }

  // Calculate date-dependent projections starting from earliest income start date or current date
  getInflationAdjustedProjection(months: number): MonthlyData[] {
    const inflationRate = this.data.settings.inflationRate / 100 / 12;
    const projections: MonthlyData[] = [];
    let cumulativeSavings = 0;
    
    // Find the earliest start date from income sources
    const incomeStartDates = this.data.incomes
      .filter(income => income.startDate)
      .map(income => new Date(income.startDate!));
    
    const earliestIncomeDate = incomeStartDates.length > 0 
      ? new Date(Math.min(...incomeStartDates.map(d => d.getTime())))
      : new Date();
    
    // Start projections from the first day of the earliest income month
    const startDate = new Date(earliestIncomeDate.getFullYear(), earliestIncomeDate.getMonth(), 1);

    for (let i = 0; i < months; i++) {
      const projectionDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const inflationMultiplier = Math.pow(1 + inflationRate, i);
      
      // Calculate income for this specific month - only if active during this month
      const monthlyIncome = this.data.incomes
        .filter(income => {
          if (!income.startDate) {
            return income.isRecurring || income.frequency !== 'one-time';
          }
          
          const startDate = new Date(income.startDate);
          const endDate = income.endDate ? new Date(income.endDate) : null;
          
          // Check if income is active in this specific month
          const monthStart = new Date(projectionDate.getFullYear(), projectionDate.getMonth(), 1);
          const monthEnd = new Date(projectionDate.getFullYear(), projectionDate.getMonth() + 1, 0);
          
          const isActiveThisMonth = startDate <= monthEnd && (!endDate || endDate >= monthStart);
          return isActiveThisMonth && (income.isRecurring || income.frequency !== 'one-time');
        })
        .reduce((total, income) => {
          return total + this.toMonthlyAmount(income.amount, income.frequency);
        }, 0);
      
      const monthlyExpenses = this.data.expenses
        .filter(expense => {
          if (!expense.startDate) {
            return true;
          }
          
          const startDate = new Date(expense.startDate);
          const endDate = expense.endDate ? new Date(expense.endDate) : null;
          
          // Check if expense is active in this specific month
          const monthStart = new Date(projectionDate.getFullYear(), projectionDate.getMonth(), 1);
          const monthEnd = new Date(projectionDate.getFullYear(), projectionDate.getMonth() + 1, 0);
          
          return startDate <= monthEnd && (!endDate || endDate >= monthStart);
        })
        .reduce((total, expense) => {
          return total + this.toMonthlyAmount(expense.budget, expense.frequency);
        }, 0);
      
      const adjustedExpenses = monthlyExpenses * inflationMultiplier;
      const surplus = monthlyIncome - adjustedExpenses;
      
      cumulativeSavings += surplus;

      projections.push({
        month: projectionDate.toISOString().substring(0, 7),
        income: monthlyIncome,
        expenses: adjustedExpenses,
        surplus,
        savings: surplus,
        categories: {
          savings: cumulativeSavings
        }
      });
    }

    return projections;
  }

  // Calculate stable income (recurring income sources, considering dates)
  getStableIncome(): number {
    const currentDate = new Date();
    return this.data.incomes
      .filter(income => {
        // Handle incomes without dates (legacy data)
        if (!income.startDate) return income.isRecurring && income.frequency !== 'one-time';
        
        const startDate = new Date(income.startDate);
        const endDate = income.endDate ? new Date(income.endDate) : null;
        const isActive = startDate <= currentDate && (!endDate || endDate >= currentDate);
        return isActive && income.isRecurring && income.frequency !== 'one-time';
      })
      .reduce((total, income) => {
        return total + this.toMonthlyAmount(income.amount, income.frequency);
      }, 0);
  }

  // Generate comprehensive analytics
  getAnalytics(): BudgetAnalytics {
    const totalIncome = this.getTotalMonthlyIncome();
    const totalExpenses = this.getTotalMonthlyExpenses();
    const netIncome = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;
    const volatilityValues = Object.values(this.getExpenseVolatilityIndex());
    const avgVolatility = volatilityValues.length > 0 ? volatilityValues.reduce((sum, val) => sum + val, 0) / volatilityValues.length : 0;

    return {
      totalIncome,
      totalExpenses,
      netIncome,
      savingsRate,
      breakEvenPoint: this.getBreakEvenPoint(),
      expenseVolatilityIndex: avgVolatility,
      cashFlowCushion: this.getCashFlowCushion(),
      sustainabilityMonths: this.getSavingsSustainability(),
      stableIncome: this.getStableIncome(),
      totalSavings: this.getTotalSavings(),
      averageMonthlySavings: this.getAverageMonthlySavings()
    };
  }
}

// Utility functions - Updated to use INR
export const formatCurrency = (amount: number, currency = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
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