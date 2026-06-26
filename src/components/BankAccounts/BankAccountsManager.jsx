import React, { useState } from 'react';
import { Plus, Edit2, Trash2, TrendingUp } from 'lucide-react';
import { useBankAccounts } from '../../context/BankAccountsContext';

export const BankAccountsManager = () => {
  const { accounts, addAccount, deleteAccount } = useBankAccounts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    bankName: '',
    accountType: 'savings',
    accountNumber: '',
    balance: '',
    color: '#667eea',
  });

  const handleAddAccount = async () => {
    if (!formData.name || !formData.bankName) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newAccount = {
        name: formData.name,
        bankName: formData.bankName,
        accountType: formData.accountType,
        accountNumber: formData.accountNumber,
        balance: parseFloat(formData.balance) || 0,
        color: formData.color,
      };

      await addAccount(newAccount);
      setIsModalOpen(false);
      setFormData({
        name: '',
        bankName: '',
        accountType: 'savings',
        accountNumber: '',
        balance: '',
        color: '#667eea',
      });
    } catch (err) {
      setError(err.message || 'Failed to add account');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (id) => {
    if (accounts.length === 1) {
      alert('You must have at least one account!');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this account?')) return;

    setLoading(true);
    setError('');

    try {
      await deleteAccount(id);
    } catch (err) {
      setError(err.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const getAccountIcon = (type) => {
    const icons = {
      savings: '🏦',
      current: '💼',
      salary: '💰',
      investment: '📈',
      other: '🏧',
    };
    return icons[type] || '🏦';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card/20 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Bank Accounts</h1>
          <p className="text-white/60">Manage all your bank accounts</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          Add Account
        </button>
      </div>

      {/* Total Balance */}
      <div className="p-6 rounded-4xl bg-gradient-to-br from-primary/20 to-secondary/10 backdrop-blur-xl border border-primary/30 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/60 text-sm font-medium mb-2">Total Balance Across All Accounts</p>
            <h2 className="text-4xl font-bold text-white">{formatCurrency(totalBalance)}</h2>
            <p className="text-success text-xs font-medium mt-2">Across {accounts.length} accounts</p>
          </div>
          <div className="p-3 rounded-2xl bg-primary/20">
            <TrendingUp size={24} className="text-primary" />
          </div>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="p-6 rounded-4xl bg-card/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all group"
            style={{
              borderLeftWidth: '4px',
              borderLeftColor: account.color,
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{getAccountIcon(account.accountType)}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{account.name}</h3>
                  <p className="text-white/60 text-xs">{account.bankName}</p>
                  <p className="text-white/40 text-xs mt-1">{account.accountNumber}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                  <Edit2 size={16} className="text-white/60" />
                </button>
                <button
                  onClick={() => handleDeleteAccount(account.id)}
                  className="p-2 hover:bg-danger/10 rounded-lg transition-all"
                >
                  <Trash2 size={16} className="text-danger" />
                </button>
              </div>
            </div>

            {/* Balance */}
            <div className="mb-4 pb-4 border-b border-white/10">
              <p className="text-white/60 text-xs font-medium mb-1">Current Balance</p>
              <h2 className="text-2xl font-bold text-white">{formatCurrency(account.balance)}</h2>
            </div>

            {/* Account Type */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/60 text-xs">
                Type: <span className="text-white font-bold capitalize">{account.accountType}</span>
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card/95 backdrop-blur-xl border border-white/20 rounded-4xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">Add Bank Account</h2>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-danger/20 border border-danger/30">
                <p className="text-danger text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Account Name</label>
                <input
                  type="text"
                  placeholder="e.g., HDFC Savings"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Bank Name</label>
                <input
                  type="text"
                  placeholder="e.g., HDFC Bank"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Account Number (Last 4)</label>
                <input
                  type="text"
                  placeholder="****1234"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Account Type</label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary/50"
                  >
                    <option value="savings">Savings</option>
                    <option value="current">Current</option>
                    <option value="salary">Salary</option>
                    <option value="investment">Investment</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Initial Balance</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setError('');
                }}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAccount}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankAccountsManager;
