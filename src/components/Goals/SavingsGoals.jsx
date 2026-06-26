import React, { useState } from 'react';
import { Target, Plus, Edit2, Trash2, TrendingUp, Calendar } from 'lucide-react';
import { useBankAccounts } from '../../context/BankAccountsContext';
import { useGoals } from '../../context/GoalsContext';
import { useNotifications } from '../../context/NotificationsContext';

export const SavingsGoals = () => {
  const { goals, addGoalItem, updateGoalItem, deleteGoalItem } = useGoals();
  const { accounts, updateAccountBalance } = useBankAccounts();
  const { addNotification } = useNotifications();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositNote, setDepositNote] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('1');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    targetDate: '',
    category: 'other',
    priority: 'medium',
    accountId: accounts.length > 0 ? accounts[0].id : '',
  });

  const handleAddGoal = async () => {
    if (!formData.name || !formData.targetAmount || !formData.accountId) return;

    const newGoal = {
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: 0,
    };

    try {
      await addGoalItem(newGoal);
      addNotification(`Goal ${formData.name} created`, 'success', 4000);
      setIsModalOpen(false);
      setFormData({
        name: '',
        description: '',
        targetAmount: '',
        targetDate: '',
        category: 'other',
        priority: 'medium',
        accountId: accounts.length > 0 ? accounts[0].id : '',
      });
    } catch (error) {
      addNotification('Failed to create goal', 'error', 5000);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await deleteGoalItem(id);
      addNotification('Goal deleted', 'success', 4000);
    } catch (error) {
      addNotification('Failed to delete goal', 'error', 5000);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || !selectedGoalId) return;

    const sourceAccount = accounts.find(a => a.id === selectedAccountId);
    const depositAmountNum = parseFloat(depositAmount);

    if (sourceAccount && sourceAccount.balance < depositAmountNum) {
      addNotification('Insufficient balance in selected account', 'error', 5000);
      return;
    }

    try {
      const goal = goals.find(g => g.id === selectedGoalId);
      await updateGoalItem(selectedGoalId, {
        currentAmount: (goal.currentAmount || 0) + depositAmountNum,
        lastDeposit: {
          amount: depositAmountNum,
          note: depositNote,
          sourceAccount: sourceAccount?.name || sourceAccount?.bankName,
          date: new Date(),
        },
      });

      if (sourceAccount) {
        await updateAccountBalance(selectedAccountId, sourceAccount.balance - depositAmountNum);
      }

      addNotification(`₹${depositAmountNum.toLocaleString()} added to goal`, 'success', 4000);
      setDepositModalOpen(false);
      setDepositAmount('');
      setDepositNote('');
      setSelectedGoalId(null);
      setSelectedAccountId('1');
    } catch (error) {
      addNotification('Failed to add funds to goal', 'error', 5000);
    }
  };

  const openDepositModal = (goalId) => {
    const goal = goals.find(g => g.id === goalId);
    setSelectedGoalId(goalId);
    setSelectedAccountId(goal?.accountId || (accounts.length > 0 ? accounts[0].id : ''));
    setDepositModalOpen(true);
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-success';
    if (percentage >= 75) return 'bg-success';
    if (percentage >= 50) return 'bg-primary';
    if (percentage >= 25) return 'bg-warning';
    return 'bg-danger';
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-danger/20 text-danger',
      medium: 'bg-warning/20 text-warning',
      low: 'bg-success/20 text-success',
    };
    return colors[priority] || 'bg-primary/20 text-primary';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      emergency: '🚨',
      vehicle: '🚗',
      property: '🏠',
      vacation: '✈️',
      education: '📚',
      wedding: '💍',
      health: '🏥',
      other: '🎯',
    };
    return icons[category] || '🎯';
  };

  const getDaysRemaining = (targetDate) => {
    const today = new Date();
    const timeDiff = new Date(targetDate) - today;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysRemaining;
  };

  const getMonthlyNeeded = (remaining, targetDate) => {
    const today = new Date();
    const timeDiff = new Date(targetDate) - today;
    const monthsRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24 * 30));
    return Math.ceil(remaining / Math.max(monthsRemaining, 1));
  };

  const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = (totalCurrentAmount / totalTargetAmount) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card/20 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Savings Goals</h1>
          <p className="text-white/60">Track your financial dreams and aspirations</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          New Goal
        </button>
      </div>

      {/* Overall Progress */}
      <div className="p-6 rounded-4xl bg-card/40 backdrop-blur-xl border border-white/10 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Overall Progress</h2>
            <p className="text-white/60 text-sm">
              {goals.length} goals • {formatCurrency(totalCurrentAmount)} of {formatCurrency(totalTargetAmount)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">{overallProgress.toFixed(0)}%</p>
            <p className="text-white/60 text-sm">Complete</p>
          </div>
        </div>
        <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-full p-12 rounded-4xl bg-card/40 border border-white/10 text-center">
            <Target size={48} className="mx-auto text-white/30 mb-4" />
            <p className="text-white/60">No savings goals yet. Create your first goal!</p>
          </div>
        ) : (
          goals.map((goal) => {
            const percentage = getProgressPercentage(goal.currentAmount, goal.targetAmount);
            const remaining = goal.targetAmount - goal.currentAmount;
            const daysLeft = getDaysRemaining(goal.targetDate);
            const monthlyNeeded = getMonthlyNeeded(remaining, goal.targetDate);

            return (
              <div
                key={goal.id}
                className="p-6 rounded-4xl bg-card/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all group"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3 flex-grow">
                    <div className="text-3xl">{getCategoryIcon(goal.category)}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{goal.name}</h3>
                      <p className="text-white/60 text-xs">{goal.description}</p>
                      <p className="text-primary text-xs font-semibold mt-1">
                        💳 {accounts.find(a => a.id === goal.accountId)?.name || accounts.find(a => a.id === goal.accountId)?.bankName || 'Unknown Account'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                      <Edit2 size={16} className="text-white/60" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 hover:bg-danger/10 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 size={16} className="text-danger" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-white/70 text-sm">Progress</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPriorityBadge(goal.priority)}`}>
                      {goal.priority}
                    </span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full ${getProgressColor(percentage)} transition-all duration-500`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-white/60 text-xs">{percentage.toFixed(0)}% Complete</p>
                </div>

                {/* Amount Info */}
                <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Saved</span>
                    <span className="text-white font-bold">{formatCurrency(goal.currentAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Target</span>
                    <span className="text-white font-bold">{formatCurrency(goal.targetAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Remaining</span>
                    <span className={`font-bold ${remaining <= 0 ? 'text-success' : 'text-warning'}`}>
                      {formatCurrency(Math.max(0, remaining))}
                    </span>
                  </div>
                </div>

                {/* Timeline & Required Savings */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-primary" />
                    <span className="text-white/70 text-xs">
                      {daysLeft > 0 ? `${daysLeft} days remaining` : 'Goal date reached!'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-success" />
                    <span className="text-white/70 text-xs">
                      Need {formatCurrency(monthlyNeeded)}/month
                    </span>
                  </div>
                </div>

                {/* Last Deposit Info */}
                {goal.lastDeposit && (
                  <div className="mb-4 p-3 rounded-2xl bg-success/10 border border-success/20">
                    <p className="text-white/60 text-xs font-medium">Last Deposit</p>
                    <p className="text-success font-bold text-sm">{formatCurrency(goal.lastDeposit.amount)}</p>
                    <p className="text-primary text-xs font-bold mt-1">From: {goal.lastDeposit.sourceAccount}</p>
                    {goal.lastDeposit.note && (
                      <p className="text-white/60 text-xs mt-1">"{goal.lastDeposit.note}"</p>
                    )}
                    <p className="text-white/40 text-xs mt-1">
                      {new Date(goal.lastDeposit.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                )}

                {/* Deposit Button */}
                <button
                  onClick={() => openDepositModal(goal.id)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-gradient-to-r from-success to-primary text-white font-bold hover:scale-105 transition-transform"
                >
                  + Add Funds
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card/95 backdrop-blur-xl border border-white/20 rounded-4xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">Create Savings Goal</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Goal Name</label>
                <input
                  type="text"
                  placeholder="e.g., Emergency Fund"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Description</label>
                <input
                  type="text"
                  placeholder="What's this goal for?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Target Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Target Date</label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Save to Account</label>
                <select
                  value={formData.accountId}
                  onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary/50"
                  disabled={accounts.length === 0}
                >
                  {accounts.length === 0 ? (
                    <option value="">No accounts available</option>
                  ) : (
                    accounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {account.name || account.bankName} (₹{account.balance?.toLocaleString('en-IN') || '0'})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary/50"
                  >
                    <option value="emergency">Emergency</option>
                    <option value="vehicle">Vehicle</option>
                    <option value="property">Property</option>
                    <option value="vacation">Vacation</option>
                    <option value="education">Education</option>
                    <option value="wedding">Wedding</option>
                    <option value="health">Health</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary/50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
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
                onClick={handleAddGoal}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:scale-105 transition-transform"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {depositModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card/95 backdrop-blur-xl border border-white/20 rounded-4xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-2">Add Funds to Goal</h2>
            <p className="text-white/60 text-sm mb-2">
              {goals.find(g => g.id === selectedGoalId)?.name}
            </p>
            <p className="text-primary text-xs font-semibold mb-6">
              💳 Linked to: {accounts.find(a => a.id === goals.find(g => g.id === selectedGoalId)?.accountId)?.name || accounts.find(a => a.id === goals.find(g => g.id === selectedGoalId)?.accountId)?.bankName || 'Unknown'}
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">From Account</label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary/50"
                >
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.name || account.bankName} (₹{account.balance?.toLocaleString('en-IN') || '0'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Amount to Deposit</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">₹</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 text-lg font-bold"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Freelance project, Bonus, Savings"
                  value={depositNote}
                  onChange={(e) => setDepositNote(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDepositModalOpen(false);
                  setDepositAmount('');
                  setDepositNote('');
                }}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                disabled={!depositAmount}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-success to-primary text-white font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Funds
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsGoals;
