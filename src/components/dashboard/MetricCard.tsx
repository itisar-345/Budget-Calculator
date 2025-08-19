import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'default' | 'success' | 'warning' | 'destructive';
}

const getColorClasses = (color: string) => {
  switch (color) {
    case 'success':
      return 'border-success/20 bg-gradient-to-br from-success/5 to-success/10';
    case 'warning':
      return 'border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10';
    case 'destructive':
      return 'border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10';
    default:
      return 'border-border bg-gradient-to-br from-card to-card/50';
  }
};

const getIconColor = (color: string) => {
  switch (color) {
    case 'success':
      return 'text-success';
    case 'warning':
      return 'text-warning';
    case 'destructive':
      return 'text-destructive';
    default:
      return 'text-accent';
  }
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'default'
}) => {

  return (
    <Card className={`${getColorClasses(color)} shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-[1.02]`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${getIconColor(color)}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">
            {subtitle}
          </p>
        )}
        {trend && (
          <div className={`text-xs mt-2 flex items-center ${
            trend.isPositive ? 'text-success' : 'text-destructive'
          }`}>
            <span className="mr-1">
              {trend.isPositive ? '↗' : '↘'}
            </span>
            {Math.abs(trend.value)}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );
};