import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useBankAccounts } from '../../context/BankAccountsContext';

export const QuickAddButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { accounts } = useBankAccounts();

  const [formData, setFormData] = useState({
    type: 'expense',
    category: 'Food',
    amount: '',
    description: '',
    accountId: '1',
    accountName: 'HDFC Current',
  });

  const QUICK_PRESETS = [
    { label: 'Food', value: 'Food', type: 'expense' },
    { label: 'Travel', value: 'Travel', type: 'expense' },
    { label: 'Entertainment', value: 'Entertainment', type: 'expense' },
    { label: 'Utilities', value: 'Utilities', type: 'expense' },
    { label: 'Salary', value: 'Salary', type: 'income' },
    { label: 'Freelance', value: 'Freelance', type: 'income' },
  ];

  const handleQuickAdd = async () => {
    try {
      console.log('Quick add:', formData);
      setIsOpen(false);
      setFormData({ type: 'expense', category: 'Food', amount: '', description: '', accountId: '1', accountName: 'HDFC Current' });
    } catch (error) {
      console.error('Error adding:', error);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform animate-float"
      >
        <Plus size={28} />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card/95 backdrop-blur-xl border border-white/20 rounded-4xl p-8 w-full max-w-md animate-scale-in">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Quick Add</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X size={20} className="text-white/60" />
              </button>
            </div>

            {/* Account Selector */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">Account</label>
              <select
                value={formData.accountId}
                onChange={(e) => {
                  const selected = accounts.find(a => a.id === e.target.value);
                  setFormData({ ...formData, accountId: e.target.value, accountName: selected?.name });
                }}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary/50"
              >
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Selector */}
            <div className="flex gap-3 mb-6">
              {['expense', 'income'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFormData({ ...formData, type })}
                  className={`flex-1 py-2.5 rounded-2xl font-bold transition-all ${
                    formData.type === type
                      ? type === 'expense'
                        ? 'bg-danger text-white'
                        : 'bg-success text-white'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  {type === 'expense' ? '💸 Expense' : '💰 Income'}
                </button>
              ))}
            </div>

            {/* Quick Presets */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-3">Quick Presets</label>
              <div className="grid grid-cols-3 gap-2">
                {QUICK_PRESETS.filter((p) => p.type === formData.type).map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setFormData({ ...formData, category: preset.value })}
                    className={`py-2 px-3 rounded-xl font-medium text-sm transition-all ${
                      formData.category === preset.value
                        ? 'bg-primary text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">₹</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 text-lg font-bold"
                  autoFocus
                />
              </div>
            </div>

            {/* Description Input */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">Description (Optional)</label>
              <input
                type="text"
                placeholder="Add notes..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary/50"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleQuickAdd}
                disabled={!formData.amount}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickAddButton;
