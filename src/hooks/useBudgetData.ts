import { useState, useEffect } from 'react';
import { BudgetData, IncomeSource, ExpenseCategory, Transaction, MonthlySavings } from '../types/budget';

const STORAGE_KEY = 'budget-calculator-data';

const defaultBudgetData: BudgetData = {
  incomes: [],
  expenses: [],
  transactions: [],
  monthlyHistory: [],
  monthlySavings: [],
  settings: {
    currency: 'INR',
    inflationRate: 6.0,
    emergencyFundTarget: 6,
  },
};

export const useBudgetData = () => {
  const [data, setData] = useState<BudgetData>(defaultBudgetData);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        setData({ ...defaultBudgetData, ...parsedData });
      }
    } catch (error) {
      console.error('Error loading budget data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving budget data:', error);
      }
    }
  }, [data, loading]);

  const addIncome = (income: Omit<IncomeSource, 'id'>) => {
    const newIncome: IncomeSource = {
      ...income,
      id: crypto.randomUUID(),
    };
    setData(prev => ({
      ...prev,
      incomes: [...prev.incomes, newIncome],
    }));
  };

  const updateIncome = (id: string, updates: Partial<IncomeSource>) => {
    setData(prev => ({
      ...prev,
      incomes: prev.incomes.map(income =>
        income.id === id ? { ...income, ...updates } : income
      ),
    }));
  };

  const deleteIncome = (id: string) => {
    setData(prev => ({
      ...prev,
      incomes: prev.incomes.filter(income => income.id !== id),
    }));
  };

  const addExpense = (expense: Omit<ExpenseCategory, 'id'>) => {
    const newExpense: ExpenseCategory = {
      ...expense,
      id: crypto.randomUUID(),
    };
    setData(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense],
    }));
  };

  const updateExpense = (id: string, updates: Partial<ExpenseCategory>) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.map(expense =>
        expense.id === id ? { ...expense, ...updates } : expense
      ),
    }));
  };

  const deleteExpense = (id: string) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(expense => expense.id !== id),
    }));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setData(prev => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction],
    }));
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.map(transaction =>
        transaction.id === id ? { ...transaction, ...updates } : transaction
      ),
    }));
  };

  const deleteTransaction = (id: string) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.filter(transaction => transaction.id !== id),
    }));
  };

  const addSavings = (savings: Omit<MonthlySavings, 'id'>) => {
    const newSavings: MonthlySavings = {
      ...savings,
      id: crypto.randomUUID(),
    };
    setData(prev => ({
      ...prev,
      monthlySavings: [...prev.monthlySavings, newSavings],
    }));
  };

  const deleteSavings = (id: string) => {
    setData(prev => ({
      ...prev,
      monthlySavings: prev.monthlySavings.filter(savings => savings.id !== id),
    }));
  };



  const exportData = () => {
    const csvContent = [
      ['Type', 'Name', 'Amount', 'Frequency', 'Start Date', 'End Date'],
      ...data.incomes.map(income => [
        'Income',
        income.name,
        income.amount.toString(),
        income.frequency,
        income.startDate || '',
        income.endDate || ''
      ]),
      ...data.expenses.map(expense => [
        'Expense',
        expense.name,
        expense.budget.toString(),
        expense.frequency,
        expense.startDate || '',
        expense.endDate || ''
      ]),
      ...data.monthlySavings.map(savings => [
        'Savings',
        `${savings.month} Savings`,
        savings.amount.toString(),
        'monthly',
        savings.month + '-01',
        ''
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `budget-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    setData(defaultBudgetData);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    data,
    loading,
    addIncome,
    updateIncome,
    deleteIncome,
    addExpense,
    updateExpense,
    deleteExpense,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addSavings,
    deleteSavings,
    exportData,
    clearAllData,
  };
};