import React from 'react';
import { TrendingUp, TrendingDown, Calendar, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SummaryCard = ({
  totalBalance = 0,
  monthlyIncome = 0,
  monthlyExpenses = 0,
  upcomingPayments = 0,
  savingsRate = 0
}) => {
  const navigate = useNavigate();

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const CardWrapper = ({ children, onClick }) => (
    <div
      onClick={onClick}
      className="p-6 rounded-4xl backdrop-blur-xl hover:scale-105 transition-all group cursor-pointer"
      style={{
        background: children.props.background,
        border: children.props.borderColor,
      }}
    >
      {children}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Balance */}
      <div
        onClick={() => navigate('/bank-accounts')}
        className="p-6 rounded-4xl bg-gradient-to-br from-primary/20 to-secondary/10 backdrop-blur-xl border border-primary/30 hover:border-primary/50 hover:scale-105 transition-all group cursor-pointer"
      >
        <div className="flex justify-between items-start mb-3">
          <span className="text-white/60 text-sm font-medium">Total Balance</span>
          <div className="p-2.5 rounded-2xl bg-primary/20 group-hover:bg-primary/30 transition-all">
            <TrendingUp size={18} className="text-primary" />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-white mb-1">
          {formatCurrency(totalBalance)}
        </h3>
        <p className="text-success text-xs font-medium">Click to view accounts</p>
      </div>

      {/* Monthly Income */}
      <div
        onClick={() => navigate('/income')}
        className="p-6 rounded-4xl bg-gradient-to-br from-success/20 to-primary/10 backdrop-blur-xl border border-success/30 hover:border-success/50 hover:scale-105 transition-all group cursor-pointer"
      >
        <div className="flex justify-between items-start mb-3">
          <span className="text-white/60 text-sm font-medium">Monthly Income</span>
          <div className="p-2.5 rounded-2xl bg-success/20 group-hover:bg-success/30 transition-all">
            <TrendingUp size={18} className="text-success" />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-white mb-1">
          {formatCurrency(monthlyIncome)}
        </h3>
        <p className="text-success text-xs font-medium">Click to view income</p>
      </div>

      {/* Monthly Spending */}
      <div
        onClick={() => navigate('/expenses')}
        className="p-6 rounded-4xl bg-gradient-to-br from-warning/20 to-danger/10 backdrop-blur-xl border border-warning/30 hover:border-warning/50 hover:scale-105 transition-all group cursor-pointer"
      >
        <div className="flex justify-between items-start mb-3">
          <span className="text-white/60 text-sm font-medium">Monthly Spending</span>
          <div className="p-2.5 rounded-2xl bg-warning/20 group-hover:bg-warning/30 transition-all">
            <TrendingDown size={18} className="text-warning" />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-white mb-1">
          {formatCurrency(monthlyExpenses)}
        </h3>
        <p className="text-warning text-xs font-medium">Click to view expenses</p>
      </div>

      {/* Savings Rate */}
      <div
        onClick={() => navigate('/transactions')}
        className="p-6 rounded-4xl bg-gradient-to-br from-primary/20 to-secondary/10 backdrop-blur-xl border border-primary/30 hover:border-primary/50 hover:scale-105 transition-all group cursor-pointer"
      >
        <div className="flex justify-between items-start mb-3">
          <span className="text-white/60 text-sm font-medium">Savings Rate</span>
          <div className="p-2.5 rounded-2xl bg-primary/20 group-hover:bg-primary/30 transition-all">
            <Calendar size={18} className="text-primary" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <h3 className="text-3xl font-bold text-white">{savingsRate.toFixed(1)}</h3>
          <span className="text-white/60 text-sm">%</span>
        </div>
        <p className="text-primary text-xs font-medium">Click to view transactions</p>
      </div>
    </div>
  );
};

export default SummaryCard;
