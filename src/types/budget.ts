export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'weekly' | 'biweekly' | 'yearly' | 'one-time';
  category: 'salary' | 'freelancing' | 'investments' | 'rental' | 'business' | 'other';
  isRecurring: boolean;
  startDate: string;
  endDate?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  type: 'fixed' | 'variable' | 'occasional';
  budget: number;
  spent: number;
  frequency: 'monthly' | 'weekly' | 'biweekly' | 'yearly' | 'one-time';
  color: string;
  subcategories?: string[];
  startDate: string;
  endDate?: string;
}

export interface MonthlySavings {
  id: string;
  month: string;
  amount: number;
  description?: string;
}

export interface Transaction {
  id: string;
  categoryId: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

export interface FinancialGoal {
  id: string;
  name: string;
  type: 'savings' | 'debt' | 'investment';
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
}

export interface BudgetAnalytics {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  savingsRate: number;
  breakEvenPoint: number;
  expenseVolatilityIndex: number;
  cashFlowCushion: number;
  sustainabilityMonths: number;
  stableIncome: number;
  totalSavings: number;
  averageMonthlySavings: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  surplus: number;
  savings: number;
  categories: Record<string, number>;
}

export interface BudgetData {
  incomes: IncomeSource[];
  expenses: ExpenseCategory[];
  transactions: Transaction[];
  monthlyHistory: MonthlyData[];
  monthlySavings: MonthlySavings[];
  settings: {
    currency: string;
    inflationRate: number;
    emergencyFundTarget: number;
  };
}