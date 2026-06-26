import React, { useState } from 'react';
import { Bell, X, Filter, ChevronDown } from 'lucide-react';

interface Notification {
  id: string;
  type: 'budget' | 'bill' | 'spending' | 'unusual' | 'insight';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  action?: {
    label: string;
    target: string;
  };
}

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'budget',
      severity: 'critical',
      title: 'Food Budget Exceeded',
      message: 'You have exceeded your Food budget by ₹2,500. Consider reviewing your spending.',
      read: false,
      createdAt: new Date(),
      action: { label: 'View Budget', target: '/budgets' },
    },
    {
      id: '2',
      type: 'bill',
      severity: 'warning',
      title: 'Credit Card Bill Due Soon',
      message: 'Your credit card bill of ₹5,000 is due in 3 days (June 28)',
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      action: { label: 'Pay Now', target: '/bills' },
    },
    {
      id: '3',
      type: 'spending',
      severity: 'warning',
      title: 'High Spending Alert',
      message: 'Your daily spending is 35% above your monthly average for this date.',
      read: false,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      action: { label: 'View Analytics', target: '/analytics' },
    },
    {
      id: '4',
      type: 'unusual',
      severity: 'warning',
      title: 'Unusual Transaction Detected',
      message: '₹15,000 transaction detected at an unfamiliar location (Mumbai)',
      read: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      action: { label: 'Review Transaction', target: '/transactions' },
    },
    {
      id: '5',
      type: 'insight',
      severity: 'info',
      title: 'Spending Insight',
      message: 'You saved ₹12,500 this month compared to last month! Keep up the good work.',
      read: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      action: { label: 'View Insights', target: '/insights' },
    },
  ]);

  const [filterType, setFilterType] = useState<'all' | 'unread'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'unread' && n.read) return false;
    if (filterCategory !== 'all' && n.type !== filterCategory) return false;
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical':
        return 'border-danger/30 bg-danger/10';
      case 'warning':
        return 'border-warning/30 bg-warning/10';
      default:
        return 'border-white/10 bg-white/5';
    }
  };

  const getSeverityBadgeColor = (severity: string): string => {
    switch (severity) {
      case 'critical':
        return 'bg-danger/20 text-danger';
      case 'warning':
        return 'bg-warning/20 text-warning';
      default:
        return 'bg-primary/20 text-primary';
    }
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'budget':
        return '💰';
      case 'bill':
        return '📄';
      case 'spending':
        return '📊';
      case 'unusual':
        return '⚠️';
      case 'insight':
        return '💡';
      default:
        return '📌';
    }
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString('en-IN');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card/20 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Notifications</h1>
            <p className="text-white/60">Stay updated with your financial activity</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 rounded-2xl bg-primary/20 text-primary font-medium hover:bg-primary/30 transition-all"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Type Filter */}
          <div>
            <label className="block text-white/60 text-xs font-medium mb-2">Filter by</label>
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'unread')}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
              >
                <option value="all">All Notifications ({notifications.length})</option>
                <option value="unread">Unread ({unreadCount})</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-white/60 text-xs font-medium mb-2">Category</label>
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="budget">Budget Alerts</option>
                <option value="bill">Bill Reminders</option>
                <option value="spending">Spending Alerts</option>
                <option value="unusual">Unusual Activity</option>
                <option value="insight">Insights</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 rounded-4xl bg-card/40 border border-white/10 text-center">
            <Bell size={48} className="mx-auto text-white/30 mb-4" />
            <p className="text-white/60">No notifications to show</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 rounded-3xl border ${getSeverityColor(
                notification.severity
              )} transition-all ${!notification.read ? 'ring-1 ring-primary/50' : ''}`}
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className="text-3xl flex-shrink-0">{getTypeIcon(notification.type)}</div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3">
                        <h3 className="text-white font-bold">{notification.title}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityBadgeColor(
                            notification.severity
                          )}`}
                        >
                          {notification.severity}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-white/70 text-sm mt-2">{notification.message}</p>
                    </div>
                  </div>

                  {/* Time & Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <span className="text-white/40 text-xs">{formatDate(notification.createdAt)}</span>
                    <div className="flex gap-3">
                      {notification.action && (
                        <a
                          href={notification.action.target}
                          className="text-primary text-sm font-bold hover:text-primary/80 transition-all"
                        >
                          {notification.action.label} →
                        </a>
                      )}
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-white/60 text-sm font-bold hover:text-white transition-all"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => handleDismiss(notification.id)}
                        className="p-1 hover:bg-white/10 rounded-lg transition-all"
                      >
                        <X size={16} className="text-white/60" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
