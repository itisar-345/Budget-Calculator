import React, { useState } from 'react';
import { PiggyBank } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { MonthlySavings } from '../../types/budget';

interface SavingsFormProps {
  onAddSavings: (savings: Omit<MonthlySavings, 'id'>) => void;
}

export const SavingsForm: React.FC<SavingsFormProps> = ({ onAddSavings }) => {
  const [formData, setFormData] = useState({
    month: new Date().toISOString().substring(0, 7),
    amount: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.month || !formData.amount) return;

    onAddSavings({
      month: formData.month,
      amount: parseFloat(formData.amount),
      description: formData.description,
    });

    setFormData({
      month: new Date().toISOString().substring(0, 7),
      amount: '',
      description: '',
    });
  };

  return (
    <Card className="shadow-card border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PiggyBank className="h-5 w-5 text-success" />
          Add Monthly Savings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="savings-month">Month</Label>
              <Input
                id="savings-month"
                type="month"
                value={formData.month}
                onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="savings-amount">Amount Saved</Label>
              <Input
                id="savings-amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="₹0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="savings-description">Description (Optional)</Label>
            <Input
              id="savings-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="e.g., Emergency fund, Investment, etc."
            />
          </div>

          <Button type="submit" className="w-full">
            Add Savings Record
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};