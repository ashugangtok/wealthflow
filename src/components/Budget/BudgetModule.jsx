import React, { useState, useEffect } from 'react';
import { TrendingDown, Plus, Edit2, Trash2 } from 'lucide-react';
import { useBudgets } from '../../context/BudgetsContext';
import { useNotifications } from '../../context/NotificationsContext';

export const BudgetModule = () => {
  const { budgets, addBudgetItem, deleteBudgetItem } = useBudgets();
  const { addNotification } = useNotifications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    period: 'monthly',
  });

  const handleAddBudget = async () => {
    if (!formData.category || !formData.limit) return;

    const newBudget = {
      ...formData,
      spent: 0,
      limit: parseFloat(formData.limit),
      isCategory: true, // Mark budget as a custom category for expenses
    };

    try {
      await addBudgetItem(newBudget);
      addNotification(`Budget for ${formData.category} created`, 'success', 4000);
      setIsModalOpen(false);
      setFormData({ category: '', limit: '', period: 'monthly' });
    } catch (error) {
      addNotification('Failed to create budget', 'error', 5000);
    }
  };

  const getUtilizationColor = (utilization) => {
    if (utilization > 90) return 'text-danger bg-danger/10';
    if (utilization > 70) return 'text-warning bg-warning/10';
    return 'text-success bg-success/10';
  };

  const getProgressColor = (utilization) => {
    if (utilization > 90) return 'bg-danger';
    if (utilization > 70) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card/20 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Budgets</h1>
          <p className="text-white/60">Manage your spending limits</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          Add Budget
        </button>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {budgets.length === 0 ? (
          <div className="col-span-full p-12 rounded-4xl bg-card/40 border border-white/10 text-center">
            <TrendingDown size={48} className="mx-auto text-white/30 mb-4" />
            <p className="text-white/60">No budgets yet. Create your first budget to track spending!</p>
          </div>
        ) : (
          budgets.map((budget) => {
            const utilization = (budget.spent / budget.limit) * 100;
            const isOver = budget.spent > budget.limit;
            const isWarning = utilization >= 70 && utilization < 100;

            return (
              <div
                key={budget.id}
                className={`p-6 rounded-4xl backdrop-blur-xl border transition-all ${
                  isOver
                    ? 'bg-danger/10 border-danger/30'
                    : isWarning
                    ? 'bg-warning/10 border-warning/30'
                    : 'bg-card/40 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Status Alert */}
                {isOver && (
                  <div className="mb-4 p-2 rounded-2xl bg-danger/20 border border-danger/40">
                    <p className="text-danger text-sm font-bold">⚠️ Over Budget</p>
                  </div>
                )}
                {isWarning && !isOver && (
                  <div className="mb-4 p-2 rounded-2xl bg-warning/20 border border-warning/40">
                    <p className="text-warning text-sm font-bold">⚡ Approaching Limit</p>
                  </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{budget.category}</h3>
                    <p className="text-white/60 text-sm">{budget.period === 'monthly' ? 'Monthly' : 'Yearly'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                      <Edit2 size={16} className="text-white/60" />
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await deleteBudgetItem(budget.id);
                          addNotification(`Budget for ${budget.category} deleted`, 'success', 4000);
                        } catch (error) {
                          addNotification('Failed to delete budget', 'error', 5000);
                        }
                      }}
                      className="p-2 hover:bg-danger/10 rounded-lg transition-all"
                    >
                      <Trash2 size={16} className="text-danger" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-white/70 text-sm">Spent</span>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${getUtilizationColor(utilization)}`}>
                      {utilization.toFixed(0)}%
                    </div>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressColor(utilization)} transition-all duration-500`}
                      style={{ width: `${Math.min(100, utilization)}%` }}
                    />
                  </div>
                </div>

                {/* Amount Info */}
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <div className="flex justify-between">
                    <span className="text-white/60">Spent</span>
                    <span className="text-white font-bold">₹{budget.spent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Limit</span>
                    <span className="text-white font-bold">₹{budget.limit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Remaining</span>
                    <span className={`font-bold ${budget.spent > budget.limit ? 'text-danger' : 'text-success'}`}>
                      ₹{Math.max(0, budget.limit - budget.spent).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card/95 backdrop-blur-xl border border-white/20 rounded-4xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">Add Budget</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  placeholder="e.g., Food, Travel"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Limit</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.limit}
                  onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Period</label>
                <select
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary/50"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBudget}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:scale-105 transition-transform"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetModule;
