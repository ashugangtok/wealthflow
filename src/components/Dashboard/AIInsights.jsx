import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Lightbulb, Target, CheckCircle } from 'lucide-react';

export const AIInsights = ({ expenses = [], budgets = [], monthlyIncome = 0 }) => {
  const insights = useMemo(() => {
    const result = [];

    // 1. Overspending detection
    const overspentCategories = budgets
      .filter(b => b.spent > b.limit)
      .sort((a, b) => ((b.spent - b.limit) / b.limit) * 100 - ((a.spent - a.limit) / a.limit) * 100)
      .slice(0, 1);

    if (overspentCategories.length > 0) {
      const cat = overspentCategories[0];
      const overAmount = cat.spent - cat.limit;
      result.push({
        type: 'warning',
        icon: AlertCircle,
        title: '⚠️ Overspending Alert',
        message: `You've overspent on "${cat.category}" by ₹${overAmount.toLocaleString()}`,
        action: 'Review spending and set stricter limits',
      });
    }

    // 2. Top spending category
    const categorySpending = {};
    expenses.forEach(exp => {
      categorySpending[exp.category] = (categorySpending[exp.category] || 0) + exp.amount;
    });

    const topCategory = Object.entries(categorySpending)
      .sort(([, a], [, b]) => b - a)[0];

    if (topCategory) {
      const [category, amount] = topCategory;
      const percentage = ((amount / (monthlyIncome || 1)) * 100).toFixed(1);
      result.push({
        type: 'info',
        icon: TrendingDown,
        title: '📊 Highest Spending',
        message: `"${category}" is your biggest expense at ₹${amount.toLocaleString()} (${percentage}% of income)`,
        action: 'Look for ways to reduce this expense',
      });
    }

    // 3. Savings rate insight
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - totalExpenses) / monthlyIncome * 100).toFixed(1) : 0;

    if (savingsRate >= 20) {
      result.push({
        type: 'success',
        icon: TrendingUp,
        title: '🎯 Great Savings Rate',
        message: `You're saving ${savingsRate}% of your income. Keep it up!`,
        action: 'Consider allocating savings to investment goals',
      });
    } else if (savingsRate > 0) {
      result.push({
        type: 'info',
        icon: Target,
        title: '💡 Savings Opportunity',
        message: `You're saving ${savingsRate}% of income. Target 20%+ for financial growth`,
        action: `Cut expenses by ₹${Math.max(0, monthlyIncome * 0.2 - (monthlyIncome - totalExpenses)).toFixed(0)} to reach 20%`,
      });
    }

    // 4. Budget adherence
    const onBudget = budgets.filter(b => b.spent <= b.limit).length;
    const adherenceRate = budgets.length > 0 ? ((onBudget / budgets.length) * 100).toFixed(0) : 0;

    if (budgets.length > 0) {
      if (adherenceRate >= 75) {
        result.push({
          type: 'success',
          icon: CheckCircle,
          title: '✅ Budget Master',
          message: `You're staying on budget ${adherenceRate}% of the time. Excellent!`,
          action: 'Maintain these habits for long-term financial stability',
        });
      } else {
        result.push({
          type: 'warning',
          icon: AlertCircle,
          title: '📌 Budget Review Needed',
          message: `Only ${adherenceRate}% of budgets are on track. Review and adjust limits`,
          action: 'Be more mindful of spending in overspent categories',
        });
      }
    }

    // 5. Income adequacy
    if (monthlyIncome === 0) {
      result.push({
        type: 'warning',
        icon: AlertCircle,
        title: '💰 No Income Recorded',
        message: 'Add your monthly income to get personalized insights',
        action: 'Log your salary or income sources',
      });
    }

    return result.slice(0, 4); // Return top 4 insights
  }, [expenses, budgets, monthlyIncome]);

  const getColor = (type) => {
    switch (type) {
      case 'success':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'warning':
        return 'from-orange-500/20 to-red-500/20 border-orange-500/30';
      case 'info':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      default:
        return 'from-primary/20 to-secondary/20 border-primary/30';
    }
  };

  const getTextColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-orange-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="p-6 rounded-4xl bg-card/40 backdrop-blur-xl border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Lightbulb size={24} className="text-primary" />
        AI Insights
      </h2>

      <div className="space-y-4">
        {insights.length === 0 ? (
          <p className="text-white/60 text-center py-8">Log some transactions to get personalized insights</p>
        ) : (
          insights.map((insight, idx) => {
            const Icon = insight.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl bg-gradient-to-r ${getColor(insight.type)} border transition-all hover:border-white/20`}
              >
                <div className="flex gap-3">
                  <Icon className={`${getTextColor(insight.type)} flex-shrink-0 mt-1`} size={20} />
                  <div className="flex-1">
                    <h3 className={`font-bold ${getTextColor(insight.type)} mb-1`}>{insight.title}</h3>
                    <p className="text-white/80 text-sm mb-2">{insight.message}</p>
                    <p className="text-white/60 text-xs">{insight.action}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AIInsights;
