import React, { useMemo } from 'react';
import {
  Utensils,
  Plane,
  Zap,
  Home,
  ShoppingCart,
  Heart,
  Book,
  Gamepad2,
  Music,
  Fuel,
  Smartphone,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Calendar,
  MoreVertical,
} from 'lucide-react';

interface BudgetItem {
  id: string;
  name: string;
  category: string;
  spent: number;
  limit: number;
  period: 'monthly' | 'yearly';
  color?: string;
  lastUpdated?: Date;
}

interface BudgetTrackerProps {
  budgets: BudgetItem[];
  onEditBudget?: (budgetId: string) => void;
  onDeleteBudget?: (budgetId: string) => void;
  compact?: boolean;
  showActions?: boolean;
}

// Category icon mapping
const categoryIconMap: Record<string, React.ReactNode> = {
  food: <Utensils size={20} />,
  groceries: <ShoppingCart size={20} />,
  dining: <Utensils size={20} />,
  travel: <Plane size={20} />,
  fuel: <Fuel size={20} />,
  utilities: <Zap size={20} />,
  housing: <Home size={20} />,
  shopping: <ShoppingCart size={20} />,
  health: <Heart size={20} />,
  education: <Book size={20} />,
  entertainment: <Gamepad2 size={20} />,
  music: <Music size={20} />,
  phone: <Smartphone size={20} />,
  other: <DollarSign size={20} />,
};

// Category color mapping
const categoryColorMap: Record<string, { bg: string; text: string; progress: string; icon: string }> = {
  food: { bg: 'bg-orange-500/10', text: 'text-orange-400', progress: 'bg-gradient-to-r from-orange-500 to-red-500', icon: 'text-orange-400' },
  groceries: { bg: 'bg-green-500/10', text: 'text-green-400', progress: 'bg-gradient-to-r from-green-500 to-emerald-500', icon: 'text-green-400' },
  dining: { bg: 'bg-rose-500/10', text: 'text-rose-400', progress: 'bg-gradient-to-r from-rose-500 to-pink-500', icon: 'text-rose-400' },
  travel: { bg: 'bg-blue-500/10', text: 'text-blue-400', progress: 'bg-gradient-to-r from-blue-500 to-cyan-500', icon: 'text-blue-400' },
  fuel: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', progress: 'bg-gradient-to-r from-yellow-500 to-orange-500', icon: 'text-yellow-400' },
  utilities: { bg: 'bg-violet-500/10', text: 'text-violet-400', progress: 'bg-gradient-to-r from-violet-500 to-purple-500', icon: 'text-violet-400' },
  housing: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', progress: 'bg-gradient-to-r from-indigo-500 to-blue-500', icon: 'text-indigo-400' },
  shopping: { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-400', progress: 'bg-gradient-to-r from-fuchsia-500 to-pink-500', icon: 'text-fuchsia-400' },
  health: { bg: 'bg-red-500/10', text: 'text-red-400', progress: 'bg-gradient-to-r from-red-500 to-rose-500', icon: 'text-red-400' },
  education: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', progress: 'bg-gradient-to-r from-cyan-500 to-blue-500', icon: 'text-cyan-400' },
  entertainment: { bg: 'bg-pink-500/10', text: 'text-pink-400', progress: 'bg-gradient-to-r from-pink-500 to-fuchsia-500', icon: 'text-pink-400' },
  music: { bg: 'bg-purple-500/10', text: 'text-purple-400', progress: 'bg-gradient-to-r from-purple-500 to-pink-500', icon: 'text-purple-400' },
  phone: { bg: 'bg-teal-500/10', text: 'text-teal-400', progress: 'bg-gradient-to-r from-teal-500 to-cyan-500', icon: 'text-teal-400' },
  default: { bg: 'bg-gray-500/10', text: 'text-gray-400', progress: 'bg-gradient-to-r from-gray-500 to-slate-500', icon: 'text-gray-400' },
};

// Status type and indicator component
type StatusType = 'on_track' | 'warning' | 'over_budget';

interface StatusIndicatorProps {
  status: StatusType;
  percentage: number;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, percentage }) => {
  const statusConfig = {
    on_track: {
      label: 'On Track',
      icon: <CheckCircle2 size={16} />,
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
      dotColor: 'bg-emerald-500',
    },
    warning: {
      label: 'Warning',
      icon: <AlertTriangle size={16} />,
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-400',
      dotColor: 'bg-amber-500',
    },
    over_budget: {
      label: 'Over Budget',
      icon: <TrendingUp size={16} />,
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-400',
      dotColor: 'bg-red-500',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor}`}>
      <div className={`${config.dotColor} w-2 h-2 rounded-full`} />
      <span className={`text-sm font-semibold ${config.textColor} flex items-center gap-1.5`}>
        {config.icon}
        {config.label}
      </span>
    </div>
  );
};

// Budget card component
interface BudgetCardProps {
  budget: BudgetItem;
  colors: typeof categoryColorMap[string];
  icon: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  compact?: boolean;
}

const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  colors,
  icon,
  onEdit,
  onDelete,
  showActions = true,
  compact = false,
}) => {
  const percentage = (budget.spent / budget.limit) * 100;
  const remaining = Math.max(0, budget.limit - budget.spent);
  const isOverBudget = budget.spent > budget.limit;

  const status: StatusType = isOverBudget ? 'over_budget' : percentage >= 75 ? 'warning' : 'on_track';

  if (compact) {
    return (
      <div className={`p-4 rounded-2xl ${colors.bg} border border-white/10 hover:border-white/20 transition-all group`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${colors.bg} border border-white/10`}>
              <span className={colors.icon}>{icon}</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{budget.name}</h3>
              <p className="text-xs text-white/40">
                {budget.period === 'monthly' ? 'Monthly' : 'Yearly'}
              </p>
            </div>
          </div>
          {showActions && (
            <button className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 rounded-lg">
              <MoreVertical size={16} className="text-white/40" />
            </button>
          )}
        </div>

        <div className="space-y-2">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full ${colors.progress} transition-all duration-500`}
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/60">
              ₹{budget.spent.toLocaleString()} / ₹{budget.limit.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-white">{percentage.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-3xl ${colors.bg} border border-white/10 hover:border-white/20 transition-all group backdrop-blur-sm`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors`}>
            <span className={`block ${colors.icon}`}>{icon}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{budget.name}</h3>
            <p className="text-sm text-white/50 flex items-center gap-1 mt-0.5">
              <Calendar size={14} />
              {budget.period === 'monthly' ? 'Monthly' : 'Yearly'}
            </p>
          </div>
        </div>
        {showActions && (
          <button
            onClick={() => onDelete?.()}
            className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 rounded-xl hover:text-red-400 text-white/40"
          >
            <MoreVertical size={18} />
          </button>
        )}
      </div>

      {/* Status Badge */}
      <div className="mb-5">
        <StatusIndicator status={status} percentage={percentage} />
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-white/70">Spending Progress</span>
          <span className={`text-lg font-bold ${colors.text}`}>{percentage.toFixed(0)}%</span>
        </div>
        <div className="h-4 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
          <div
            className={`h-full ${colors.progress} transition-all duration-700 relative shadow-lg shadow-orange-500/50`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          >
            <div className="absolute inset-0 bg-white/10" />
          </div>
        </div>
      </div>

      {/* Amount Details */}
      <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-white/5 rounded-2xl border border-white/5">
        <div>
          <p className="text-xs text-white/50 font-medium mb-1.5">Spent</p>
          <p className={`text-lg font-bold ${colors.text}`}>
            ₹{budget.spent.toLocaleString()}
          </p>
        </div>
        <div className="border-l border-r border-white/10">
          <p className="text-xs text-white/50 font-medium mb-1.5">Limit</p>
          <p className="text-lg font-bold text-white">₹{budget.limit.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-white/50 font-medium mb-1.5">Remaining</p>
          <p className={`text-lg font-bold ${isOverBudget ? 'text-red-400' : 'text-emerald-400'}`}>
            ₹{remaining.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Over Budget Warning */}
      {isOverBudget && (
        <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5">
          <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">
            Over budget by ₹{(budget.spent - budget.limit).toLocaleString()}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="flex gap-2 mt-5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all border border-white/10 hover:border-white/20"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold transition-all border border-red-500/20 hover:border-red-500/40"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

// Main component
export const BudgetTracker: React.FC<BudgetTrackerProps> = ({
  budgets,
  onEditBudget,
  onDeleteBudget,
  compact = false,
  showActions = true,
}) => {
  const stats = useMemo(() => {
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
    const onTrackCount = budgets.filter((b) => {
      const percentage = (b.spent / b.limit) * 100;
      return !isOverBudget(b) && percentage < 75;
    }).length;
    const warningCount = budgets.filter((b) => {
      const percentage = (b.spent / b.limit) * 100;
      return !isOverBudget(b) && percentage >= 75;
    }).length;
    const overBudgetCount = budgets.filter((b) => isOverBudget(b)).length;

    return {
      totalSpent,
      totalLimit,
      onTrackCount,
      warningCount,
      overBudgetCount,
      overallPercentage: totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0,
    };
  }, [budgets]);

  const isOverBudget = (budget: BudgetItem) => budget.spent > budget.limit;

  if (budgets.length === 0) {
    return (
      <div className="text-center p-12">
        <DollarSign size={48} className="mx-auto text-white/20 mb-4" />
        <p className="text-white/60">No budgets created yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Summary Stats */}
      {!compact && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-blue-300 mb-2">Total Spent</p>
            <p className="text-2xl font-bold text-blue-400">₹{stats.totalSpent.toLocaleString()}</p>
          </div>
          <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
            <p className="text-sm text-cyan-300 mb-2">Total Limit</p>
            <p className="text-2xl font-bold text-cyan-400">₹{stats.totalLimit.toLocaleString()}</p>
          </div>
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-sm text-emerald-300 mb-2">On Track</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.onTrackCount}</p>
          </div>
          <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-300 mb-2">Over Budget</p>
            <p className="text-2xl font-bold text-red-400">{stats.overBudgetCount}</p>
          </div>
        </div>
      )}

      {/* Budget Cards Grid */}
      <div className={`grid gap-6 ${compact ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {budgets.map((budget) => {
          const categoryKey = budget.category.toLowerCase();
          const colors = categoryColorMap[categoryKey] || categoryColorMap.default;
          const icon = categoryIconMap[categoryKey] || categoryIconMap.other;

          return (
            <BudgetCard
              key={budget.id}
              budget={budget}
              colors={colors}
              icon={icon}
              onEdit={() => onEditBudget?.(budget.id)}
              onDelete={() => onDeleteBudget?.(budget.id)}
              showActions={showActions}
              compact={compact}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BudgetTracker;
