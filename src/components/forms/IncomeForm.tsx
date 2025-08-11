import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { IncomeSource } from '../../types/budget';

interface IncomeFormProps {
  onAddIncome: (income: Omit<IncomeSource, 'id'>) => void;
}

export const IncomeForm: React.FC<IncomeFormProps> = ({ onAddIncome }) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    frequency: 'monthly',
    category: 'salary',
    isRecurring: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.amount) return;

    onAddIncome({
      name: formData.name,
      amount: parseFloat(formData.amount),
      frequency: formData.frequency as any,
      category: formData.category as any,
      isRecurring: formData.isRecurring,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
    });

    setFormData({
      name: '',
      amount: '',
      frequency: 'monthly',
      category: 'salary',
      isRecurring: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });
  };

  return (
    <Card className="shadow-card border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-success" />
          Add Income Source
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="income-name">Income Name</Label>
              <Input
                id="income-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Primary Job, Freelance Work"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="income-amount">Amount</Label>
              <Input
                id="income-amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="income-frequency">Frequency</Label>
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
            
            <div className="space-y-2">
              <Label htmlFor="income-category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="freelancing">Freelancing</SelectItem>
                  <SelectItem value="investments">Investments</SelectItem>
                  <SelectItem value="rental">Rental Income</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="income-start">Start Date</Label>
              <Input
                id="income-start"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            
            {!formData.isRecurring && (
              <div className="space-y-2">
                <Label htmlFor="income-end">End Date (Optional)</Label>
                <Input
                  id="income-end"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="income-recurring"
              checked={formData.isRecurring}
              onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="income-recurring">Recurring income</Label>
          </div>

          <Button type="submit" className="w-full">
            Add Income Source
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};