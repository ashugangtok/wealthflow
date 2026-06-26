import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { useSubscriptions } from '../../context/SubscriptionsContext';
import { useNotifications } from '../../context/NotificationsContext';

export const Subscriptions = () => {
  const { subscriptions, addSubscriptionItem, deleteSubscriptionItem } = useSubscriptions();
  const { addNotification } = useNotifications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    billingDate: '1',
    status: 'active',
    category: 'entertainment',
  });

  const handleAddSubscription = async () => {
    if (!formData.name || !formData.amount) return;

    const newSubscription = {
      ...formData,
      amount: parseFloat(formData.amount),
      billingDate: parseInt(formData.billingDate),
    };

    try {
      await addSubscriptionItem(newSubscription);
      addNotification(`${formData.name} subscription added`, 'success', 4000);
      setIsModalOpen(false);
      setFormData({
        name: '',
        amount: '',
        billingDate: '1',
        status: 'active',
        category: 'entertainment',
      });
    } catch (error) {
      addNotification('Failed to add subscription', 'error', 5000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSubscriptionItem(id);
      addNotification('Subscription deleted', 'success', 4000);
    } catch (error) {
      addNotification('Failed to delete subscription', 'error', 5000);
    }
  };

  const totalMonthlySubscriptions = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card/20 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Subscriptions</h1>
          <p className="text-white/60">Track your recurring payments</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          Add Subscription
        </button>
      </div>

      {/* Summary */}
      <div className="p-6 rounded-4xl bg-card/40 backdrop-blur-xl border border-white/10 mb-8">
        <p className="text-white/60 mb-2">Total Monthly Subscriptions</p>
        <h2 className="text-3xl font-bold text-white">₹{totalMonthlySubscriptions.toLocaleString()}</h2>
        <p className="text-white/60 text-sm mt-2">{subscriptions.filter(s => s.status === 'active').length} active</p>
      </div>

      {/* Subscriptions List */}
      <div className="space-y-4">
        {subscriptions.length === 0 ? (
          <div className="p-12 rounded-4xl bg-card/40 border border-white/10 text-center">
            <Calendar size={48} className="mx-auto text-white/30 mb-4" />
            <p className="text-white/60">No subscriptions yet. Add one to track recurring payments.</p>
          </div>
        ) : (
          subscriptions.map((sub) => (
            <div
              key={sub.id}
              className={`p-6 rounded-4xl backdrop-blur-xl border transition-all ${
                sub.status === 'active'
                  ? 'bg-card/40 border-white/10 hover:border-white/20'
                  : 'bg-white/5 border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{sub.name}</h3>
                  <p className="text-white/60 text-sm mt-1">
                    Billing on {sub.billingDate === '1' ? '1st' : `${sub.billingDate}th`} of every month
                  </p>
                  <p className="text-white/40 text-xs mt-2 capitalize">{sub.category}</p>
                </div>

                <div className="text-right flex items-center gap-4">
                  <div>
                    <p className="text-2xl font-bold text-white">₹{sub.amount.toLocaleString()}</p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                        sub.status === 'active'
                          ? 'bg-success/20 text-success'
                          : 'bg-warning/20 text-warning'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                      <Edit2 size={16} className="text-white/60" />
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="p-2 hover:bg-danger/10 rounded-lg transition-all"
                    >
                      <Trash2 size={16} className="text-danger" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card/95 backdrop-blur-xl border border-white/20 rounded-4xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">Add Subscription</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Subscription Name</label>
                <input
                  type="text"
                  placeholder="e.g., Netflix, Spotify"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Monthly Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Billing Date</label>
                <select
                  value={formData.billingDate}
                  onChange={(e) => setFormData({ ...formData, billingDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary/50"
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day === 1 ? '1st' : day === 2 ? '2nd' : day === 3 ? '3rd' : `${day}th`} of month
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary/50"
                >
                  <option value="entertainment">Entertainment</option>
                  <option value="software">Software/SaaS</option>
                  <option value="fitness">Fitness</option>
                  <option value="news">News/Media</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary/50"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
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
                onClick={handleAddSubscription}
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

export default Subscriptions;
