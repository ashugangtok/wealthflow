import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Trash2, Edit2, ChevronDown } from 'lucide-react';
import { useBankAccounts } from '../../context/BankAccountsContext';
import { useAuth } from '../../context/AuthContext';
import { getAllIncome, getAllExpenses } from '../../utils/firebaseHelpers';
import { ensureDate } from '../../utils/dateHelpers';

export const TransactionList = () => {
  const { user } = useAuth();
  const { accounts } = useBankAccounts();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [income, expenses] = await Promise.all([
          getAllIncome(user.uid),
          getAllExpenses(user.uid)
        ]);

        const allTransactions = [
          ...(income || []).map(t => ({ ...t, type: 'income' })),
          ...(expenses || []).map(t => ({ ...t, type: 'expense' }))
        ];

        setTransactions(allTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterAccount, setFilterAccount] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedIds, setSelectedIds] = useState(new Set());

  const categories = ['Food', 'Travel', 'Entertainment', 'Utilities', 'Salary', 'Freelance'];

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const description = (t.source || t.description || '').toLowerCase();
        const category = (t.category || '').toLowerCase();
        const matchesSearch =
          description.includes(searchQuery.toLowerCase()) ||
          category.includes(searchQuery.toLowerCase());

        const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
        const matchesType = filterType === 'all' || t.type === filterType;
        const matchesAccount = filterAccount === 'all' || t.accountId === filterAccount;

        return matchesSearch && matchesCategory && matchesType && matchesAccount;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        } else {
          return b.amount - a.amount;
        }
      });
  }, [transactions, searchQuery, filterCategory, filterType, filterAccount, sortBy]);

  const handleSelectAll = () => {
    if (selectedIds.size === filteredTransactions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTransactions.map((t) => t.id)));
    }
  };

  const handleSelectTransaction = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDeleteSelected = () => {
    setTransactions((prev) => prev.filter((t) => !selectedIds.has(t.id)));
    setSelectedIds(new Set());
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (date) => {
    const d = ensureDate(date);
    if (!d || isNaN(d)) return 'Unknown';
    return d.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Food: 'from-orange-500 to-red-500',
      Travel: 'from-blue-500 to-cyan-500',
      Entertainment: 'from-purple-500 to-pink-500',
      Utilities: 'from-green-500 to-emerald-500',
      Salary: 'from-green-500 to-teal-500',
      Freelance: 'from-yellow-500 to-orange-500',
    };
    return colors[category] || 'from-primary to-secondary';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card/20 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Transactions</h1>
        <p className="text-white/60">View and manage all your transactions</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 rounded-4xl bg-card/40 border border-white/10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white/60">Loading transactions...</p>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search by description or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-white/60 text-xs font-medium mb-2">Category</label>
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            </div>
          </div>

          {/* Account Filter */}
          <div>
            <label className="block text-white/60 text-xs font-medium mb-2">Account</label>
            <div className="relative">
              <select
                value={filterAccount}
                onChange={(e) => setFilterAccount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
              >
                <option value="all">All Accounts</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-white/60 text-xs font-medium mb-2">Type</label>
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="expense">Expenses</option>
                <option value="income">Income</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-white/60 text-xs font-medium mb-2">Sort By</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
              >
                <option value="date">Latest First</option>
                <option value="amount">Highest Amount</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-primary/20 border border-primary/30 flex justify-between items-center">
          <span className="text-white font-medium">{selectedIds.size} selected</span>
          <button
            onClick={handleDeleteSelected}
            className="px-4 py-2 rounded-xl bg-danger/30 text-danger font-medium hover:bg-danger/50 transition-all"
          >
            Delete Selected
          </button>
        </div>
      )}

      {/* Transaction List */}
      {!loading && (
        <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 rounded-4xl bg-card/40 border border-white/10 text-center">
            <Filter size={48} className="mx-auto text-white/30 mb-4" />
            <p className="text-white/60">No transactions found. Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            {/* Header Row */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 text-white/60 text-xs font-medium">
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={selectedIds.size === filteredTransactions.length && filteredTransactions.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded cursor-pointer"
                />
              </div>
              <div className="col-span-4">Description</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Transaction Rows */}
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 md:p-6 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
              >
                {/* Checkbox */}
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(transaction.id)}
                    onChange={() => handleSelectTransaction(transaction.id)}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                </div>

                {/* Description */}
                <div className="col-span-4">
                  <p className="text-white font-medium">{transaction.source || transaction.description}</p>
                  <div className="flex gap-2 mt-2 md:mt-1 items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${transaction.type === 'income' ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary'}`}>
                      {transaction.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                    {transaction.tags && transaction.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full bg-white/10 text-white/60 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div className="col-span-2 md:col-span-2">
                  <div
                    className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(
                      transaction.category
                    )} text-white text-xs font-bold`}
                  >
                    {transaction.category}
                  </div>
                </div>

                {/* Date */}
                <div className="col-span-2 md:col-span-2">
                  <p className="text-white/60 text-sm">{formatDate(transaction.date)}</p>
                </div>

                {/* Amount */}
                <div className="col-span-2 md:col-span-2">
                  <p
                    className={`font-bold text-lg ${
                      transaction.type === 'income' ? 'text-success' : 'text-white'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex gap-2">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                    <Edit2 size={16} className="text-white/60" />
                  </button>
                  <button className="p-2 hover:bg-danger/10 rounded-lg transition-all">
                    <Trash2 size={16} className="text-danger" />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
        </div>
      )}

      {/* Pagination Info */}
      {filteredTransactions.length > 0 && (
        <div className="mt-6 text-center text-white/60 text-sm">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </div>
      )}
    </div>
  );
};

export default TransactionList;
