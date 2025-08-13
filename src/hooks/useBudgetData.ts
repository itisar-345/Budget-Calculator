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
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `budget-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          setData({ ...defaultBudgetData, ...importedData });
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
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
    addSavings,
    deleteSavings,
    exportData,
    importData,
    clearAllData,
  };
};