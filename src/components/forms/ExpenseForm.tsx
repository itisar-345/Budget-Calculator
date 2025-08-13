import React, { useState } from 'react';
import { Minus } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ExpenseCategory } from '../../types/budget';

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<ExpenseCategory, 'id'>) => void;
}

const expenseColors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'variable',
    budget: '',
    frequency: 'monthly',
    color: expenseColors[0],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.budget) return;

    onAddExpense({
      name: formData.name,
      type: formData.type as any,
      budget: parseFloat(formData.budget),
      spent: 0,
      frequency: formData.frequency as any,
      color: formData.color,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
    });

    setFormData({
      name: '',
      type: 'variable',
      budget: '',
      frequency: 'monthly',
      color: expenseColors[Math.floor(Math.random() * expenseColors.length)],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });
  };

  return (
    <Card className="shadow-card border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Minus className="h-5 w-5 text-destructive" />
          Add Expense Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expense-name">Category Name</Label>
              <Input
                id="expense-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Groceries, Rent, Utilities"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expense-budget">Budget Amount</Label>
              <Input
                id="expense-budget"
                type="number"
                min="0"
                step="0.01"
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                placeholder="₹0.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expense-type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed (same amount monthly)</SelectItem>
                  <SelectItem value="variable">Variable (changes monthly)</SelectItem>
                  <SelectItem value="occasional">Occasional (periodic)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expense-frequency">Frequency</Label>
              <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="one-time">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expense-start">Start Date</Label>
              <Input
                id="expense-start"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                {formData.frequency === 'weekly' && 'Weekly expenses will occur every 7 days from this date'}
                {formData.frequency === 'biweekly' && 'Bi-weekly expenses will occur every 14 days from this date'}
                {formData.frequency === 'monthly' && 'Monthly expenses will occur on this day each month'}
                {formData.frequency === 'yearly' && 'Yearly expenses will occur on this date each year'}
                {formData.frequency === 'one-time' && 'One-time expense will occur only on this date'}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expense-end">End Date (Optional)</Label>
              <Input
                id="expense-end"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty for ongoing expenses, or set when this expense stops
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-color">Color</Label>
            <div className="flex gap-2 flex-wrap">
              {expenseColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color ? 'border-foreground' : 'border-muted'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Add Expense Category
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};