import React from 'react';
import { Target, TrendingUp } from 'lucide-react';
import { useGoals } from '../../context/GoalsContext';

export const SavingsGoalsWidget = () => {
  const { goals } = useGoals();

  const getCategoryIcon = (category) => {
    const icons = {
      emergency: '🚨',
      vehicle: '🚗',
      property: '🏠',
      vacation: '✈️',
      education: '📚',
    };
    return icons[category] || '🎯';
  };

  const formatCurrency = (amount) => {
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const topGoals = goals.slice(0, 3);

  return (
    <div className="p-6 rounded-4xl bg-card/40 backdrop-blur-xl border border-white/10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Savings Goals</h2>
          <p className="text-white/60 text-sm mt-1">{goals.length} active goals</p>
        </div>
        <div className="p-3 rounded-2xl bg-primary/20">
          <Target size={20} className="text-primary" />
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals && goals.length > 0 ? (
          topGoals.map((goal) => {
          const percentage = getProgressPercentage(goal.currentAmount, goal.targetAmount);

          return (
            <div key={goal.id} className="p-4 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
              {/* Goal Title */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                  <div>
                    <p className="text-white font-bold text-sm">{goal.name}</p>
                    <p className="text-white/60 text-xs">
                      {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                </div>
                <span className="text-primary font-bold text-sm">{percentage.toFixed(0)}%</span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
          })
        ) : (
          <div className="p-8 text-center">
            <Target size={32} className="mx-auto text-white/30 mb-3" />
            <p className="text-white/60 text-sm">No savings goals yet. Create one to get started!</p>
          </div>
        )}
      </div>

      {/* View All Link */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <a href="/goals" className="text-primary text-sm font-bold hover:text-primary/80 transition-all flex items-center gap-2">
          <TrendingUp size={14} />
          View all goals →
        </a>
      </div>
    </div>
  );
};

export default SavingsGoalsWidget;
