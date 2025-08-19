import React from 'react';
import { Calculator, IndianRupee, TrendingUp, Settings, Download, Trash2, PiggyBank } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import { useBudgetData } from '../hooks/useBudgetData';
import { BudgetCalculator } from '../lib/budgetCalculations';
import { FinancialDashboard } from '../components/dashboard/FinancialDashboard';
import { QuickOverview } from '../components/dashboard/QuickOverview';
import { AdvancedAnalysis } from '../components/analysis/AdvancedAnalysis';
import { IncomeForm } from '../components/forms/IncomeForm';
import { ExpenseForm } from '../components/forms/ExpenseForm';
import { SavingsForm } from '../components/forms/SavingsForm';


const Index = () => {
  const { toast } = useToast();
  const {
    data,
    loading,
    addIncome,
    deleteIncome,
    addExpense,
    deleteExpense,
    addSavings,
    deleteSavings,
    exportData,
  } = useBudgetData();



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your budget data...</p>
        </div>
      </div>
    );
  }

  const calculator = new BudgetCalculator(data);
  const analytics = calculator.getAnalytics();



  const handleExport = () => {
    exportData();
    toast({
      title: "Export Successful",
      description: "Your budget data has been downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
                <Calculator className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Budget Calculator Pro</h1>
                <p className="text-sm text-muted-foreground">Advanced Financial Analysis</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit">
            <TabsTrigger value="dashboard" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="income" className="gap-2">
              <IndianRupee className="h-4 w-4" />
              Income
            </TabsTrigger>
            <TabsTrigger value="expenses" className="gap-2">
              <Settings className="h-4 w-4" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="savings" className="gap-2">
              <PiggyBank className="h-4 w-4" />
              Savings
            </TabsTrigger>
            <TabsTrigger value="analysis" className="gap-2">
              <Calculator className="h-4 w-4" />
              Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Financial Overview</h2>
              <p className="text-muted-foreground">
                Quick summary of your current financial status
              </p>
            </div>
            <QuickOverview analytics={analytics} />
          </TabsContent>

          <TabsContent value="income" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Income Management</h2>
              <p className="text-muted-foreground">
                Track multiple income sources and their frequencies
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IncomeForm onAddIncome={addIncome} />
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Current Income Sources</h3>
                {data.incomes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No income sources added yet. Add your first income source to get started.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.incomes.map((income) => (
                      <div key={income.id} className="p-4 bg-card rounded-lg border shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{income.name}</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {income.category} • {income.frequency}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="font-semibold text-success">
                              ₹{income.amount.toLocaleString()}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteIncome(income.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Expense Management</h2>
              <p className="text-muted-foreground">
                Organize expenses into categories and track spending patterns
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExpenseForm onAddExpense={addExpense} />
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Expense Categories</h3>
                {data.expenses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No expense categories added yet. Add your first category to start tracking.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.expenses.map((expense) => (
                      <div key={expense.id} className="p-4 bg-card rounded-lg border shadow-sm">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: expense.color }}
                            />
                            <div>
                              <h4 className="font-medium">{expense.name}</h4>
                              <p className="text-sm text-muted-foreground capitalize">
                                {expense.type} • {expense.frequency}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="font-semibold text-destructive">
                              ₹{expense.budget.toLocaleString()}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteExpense(expense.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="savings" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Monthly Savings</h2>
              <p className="text-muted-foreground">
                Track your monthly savings to analyze your financial progress
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SavingsForm onAddSavings={addSavings} />
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Savings History</h3>
                {data.monthlySavings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No savings recorded yet. Add your first monthly savings record.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.monthlySavings
                      .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime())
                      .map((savings) => (
                      <div key={savings.id} className="p-4 bg-card rounded-lg border shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">
                              {new Date(savings.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h4>
                            {savings.description && (
                              <p className="text-sm text-muted-foreground">{savings.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="font-semibold text-success">
                              ₹{savings.amount.toLocaleString()}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteSavings(savings.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Advanced Analysis</h2>
              <p className="text-muted-foreground">
                Deep insights, projections, and personalized financial recommendations
              </p>
            </div>
            
            {data.incomes.length === 0 && data.expenses.length === 0 ? (
              <div className="text-center py-12">
                <Calculator className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
                <p className="text-muted-foreground mb-4">
                  Add income sources and expense categories to view detailed analysis
                </p>
              </div>
            ) : (
              <AdvancedAnalysis analytics={analytics} data={data} />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;