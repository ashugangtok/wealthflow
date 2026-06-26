import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Calendar, AlertCircle } from 'lucide-react';

interface SummaryMetrics {
  totalBalance: number;
  monthlySpending: number;
  nextBillAmount: number;
  nextBillDate: Date;
  daysToSalary: number;
  salaryAmount: number;
}

export const SummaryCard: React.FC = () => {
  const [metrics, setMetrics] = useState<SummaryMetrics>({
    totalBalance: 125000,
    monthlySpending: 28500,
    nextBillAmount: 5000,
    nextBillDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    daysToSalary: 7,
    salaryAmount: 75000,
  });

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Balance */}
      <div className="p-6 rounded-4xl bg-gradient-to-br from-primary/20 to-secondary/10 backdrop-blur-xl border border-primary/30 hover:border-primary/50 transition-all group cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <span className="text-white/60 text-sm font-medium">Total Balance</span>
          <div className="p-2.5 rounded-2xl bg-primary/20 group-hover:bg-primary/30 transition-all">
            <TrendingUp size={18} className="text-primary" />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-white mb-1">
          {formatCurrency(metrics.totalBalance)}
        </h3>
        <p className="text-success text-xs font-medium">+₹12,500 this month</p>
      </div>

      {/* Monthly Spending */}
      <div className="p-6 rounded-4xl bg-gradient-to-br from-warning/20 to-danger/10 backdrop-blur-xl border border-warning/30 hover:border-warning/50 transition-all group cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <span className="text-white/60 text-sm font-medium">Month Spending</span>
          <div className="p-2.5 rounded-2xl bg-warning/20 group-hover:bg-warning/30 transition-all">
            <TrendingDown size={18} className="text-warning" />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-white mb-1">
          {formatCurrency(metrics.monthlySpending)}
        </h3>
        <p className="text-warning text-xs font-medium">Avg: ₹23,400</p>
      </div>

      {/* Next Bill */}
      <div className="p-6 rounded-4xl bg-gradient-to-br from-danger/20 to-warning/10 backdrop-blur-xl border border-danger/30 hover:border-danger/50 transition-all group cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <span className="text-white/60 text-sm font-medium">Next Bill</span>
          <div className="p-2.5 rounded-2xl bg-danger/20 group-hover:bg-danger/30 transition-all">
            <AlertCircle size={18} className="text-danger" />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-white mb-1">
          {formatCurrency(metrics.nextBillAmount)}
        </h3>
        <p className="text-danger text-xs font-medium">Due in 3 days</p>
      </div>

      {/* Days to Salary */}
      <div className="p-6 rounded-4xl bg-gradient-to-br from-success/20 to-primary/10 backdrop-blur-xl border border-success/30 hover:border-success/50 transition-all group cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <span className="text-white/60 text-sm font-medium">Salary in</span>
          <div className="p-2.5 rounded-2xl bg-success/20 group-hover:bg-success/30 transition-all">
            <Calendar size={18} className="text-success" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <h3 className="text-3xl font-bold text-white">{metrics.daysToSalary}</h3>
          <span className="text-white/60 text-sm">days</span>
        </div>
        <p className="text-success text-xs font-medium">{formatCurrency(metrics.salaryAmount)} incoming</p>
      </div>
    </div>
  );
};

export default SummaryCard;
