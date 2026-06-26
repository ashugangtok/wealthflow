import React from 'react';
import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

export const FinancialHealthScore = ({
  savingsRate = 0,
  debtToAssets = 0,
  emergencyFundMonths = 0,
  budgetAdherence = 0,
}) => {
  // Calculate scores (0-100)
  const savingsScore = Math.min(savingsRate * 5, 100); // 20% savings = 100
  const debtScore = Math.max(100 - (debtToAssets * 50), 0); // Lower debt = higher score
  const emergencyScore = Math.min(emergencyFundMonths * 20, 100); // 5 months = 100
  const budgetScore = budgetAdherence * 100;

  // Overall score (weighted average)
  const overallScore = Math.round(
    (savingsScore * 0.25 + debtScore * 0.25 + emergencyScore * 0.25 + budgetScore * 0.25)
  );

  const getScoreColor = (score) => {
    if (score >= 70) return 'from-green-500 to-emerald-500';
    if (score >= 40) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-rose-500';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const metrics = [
    { label: 'Savings Rate', value: savingsScore, icon: TrendingUp },
    { label: 'Debt Ratio', value: debtScore, icon: AlertCircle },
    { label: 'Emergency Fund', value: emergencyScore, icon: CheckCircle },
    { label: 'Budget Adherence', value: budgetScore, icon: CheckCircle },
  ];

  return (
    <div className="p-6 rounded-4xl bg-card/40 backdrop-blur-xl border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6">💯 Financial Health Score</h2>

      <div className="flex items-center gap-8 mb-8">
        {/* Score Circle */}
        <div className="flex-shrink-0">
          <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${getScoreColor(overallScore)} p-1`}>
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{overallScore}</div>
                <div className="text-xs text-white/60">/100</div>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{getScoreLabel(overallScore)}</h3>
          <p className="text-white/60 text-sm mb-4">
            {overallScore >= 70
              ? "Your financial health is strong. Keep up the good habits!"
              : overallScore >= 40
              ? "You're on the right track. Focus on building emergency funds and reducing debt."
              : "There's room for improvement. Start with setting a savings goal."}
          </p>

          {/* Breakdown */}
          <div className="space-y-2">
            {metrics.map((metric, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <metric.icon size={16} className="text-primary flex-shrink-0" />
                <span className="text-white/70 text-sm flex-1">{metric.label}</span>
                <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
                <span className="text-white font-bold text-sm w-8">{Math.round(metric.value)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <p className="text-white/80 text-sm">
          {overallScore >= 70
            ? "✅ Maintain your savings rate and continue building your emergency fund."
            : "💡 Consider increasing your savings rate and working towards a 3-6 month emergency fund."}
        </p>
      </div>
    </div>
  );
};

export default FinancialHealthScore;
