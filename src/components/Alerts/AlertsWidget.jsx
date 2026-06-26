import React, { useState } from 'react';
import { AlertCircle, TrendingDown, Bell, X } from 'lucide-react';

export const AlertsWidget = () => {
  const [alerts, setAlerts] = useState([
    {
      id: '1',
      type: 'budget',
      severity: 'critical',
      title: 'Food Budget Almost Exceeded',
      message: 'You have used ₹3,850 of ₹5,000. Only ₹1,150 remaining!',
      action: { label: 'View Budget', target: '/budgets' },
      read: false,
      createdAt: new Date(),
    },
    {
      id: '2',
      type: 'bill',
      severity: 'warning',
      title: 'Credit Card Bill Due Soon',
      message: 'Your credit card bill of ₹8,500 is due in 3 days',
      action: { label: 'Pay Now', target: '/bills' },
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '3',
      type: 'spending',
      severity: 'warning',
      title: 'High Spending Today',
      message: 'You spent ₹1,580 today - 45% above your daily average of ₹1,090',
      action: { label: 'View Insights', target: '/insights' },
      read: false,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: '4',
      type: 'unusual',
      severity: 'warning',
      title: 'Unusual Transaction',
      message: '₹15,000 freelance income received from XYZ Client',
      action: { label: 'Review', target: '/transactions' },
      read: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: '5',
      type: 'budget',
      severity: 'warning',
      title: 'Entertainment Budget Warning',
      message: 'You have used ₹2,100 of ₹3,000 (70% used)',
      action: { label: 'View Budget', target: '/budgets' },
      read: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ]);

  const unreadCount = alerts.filter((a) => !a.read).length;

  const handleDismiss = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleMarkAsRead = (id) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const getSeverityColor = (severity) => {
    return severity === 'critical'
      ? 'border-danger/30 bg-danger/10'
      : 'border-warning/30 bg-warning/10';
  };

  const getSeverityIcon = (severity) => {
    return severity === 'critical' ? (
      <div className="p-2 rounded-lg bg-danger/20">
        <AlertCircle size={20} className="text-danger" />
      </div>
    ) : (
      <div className="p-2 rounded-lg bg-warning/20">
        <Bell size={20} className="text-warning" />
      </div>
    );
  };

  const recentAlerts = alerts.slice(0, 3);

  return (
    <div className="p-6 rounded-4xl bg-card/40 backdrop-blur-xl border border-white/10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Alerts</h2>
          {unreadCount > 0 && (
            <p className="text-warning text-sm mt-1">{unreadCount} unread alerts</p>
          )}
        </div>
        <div className="relative">
          <button className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all">
            <Bell size={20} className="text-white" />
          </button>
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full animate-pulse" />
          )}
        </div>
      </div>

      {/* Alerts List */}
      {recentAlerts.length === 0 ? (
        <div className="p-8 text-center">
          <TrendingDown size={40} className="mx-auto text-white/30 mb-3" />
          <p className="text-white/60">All clear! No alerts right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-3xl border ${getSeverityColor(
                alert.severity
              )} transition-all hover:border-white/20`}
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">{getSeverityIcon(alert.severity)}</div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-white font-bold text-sm">{alert.title}</h3>
                      <p className="text-white/70 text-sm mt-1">{alert.message}</p>
                    </div>
                    {!alert.read && (
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                    )}
                  </div>

                  {/* Action Buttons */}
                  {alert.action && (
                    <div className="flex gap-2 mt-3">
                      <button className="text-xs font-bold text-primary hover:text-primary/80 transition-all">
                        {alert.action.label}
                      </button>
                      {!alert.read && (
                        <button
                          onClick={() => handleMarkAsRead(alert.id)}
                          className="text-xs font-bold text-white/60 hover:text-white/80 transition-all"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => handleDismiss(alert.id)}
                  className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-all"
                >
                  <X size={16} className="text-white/60" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View All Link */}
      {alerts.length > recentAlerts.length && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <a href="/alerts" className="text-primary text-sm font-bold hover:text-primary/80 transition-all">
            View all {alerts.length} alerts →
          </a>
        </div>
      )}
    </div>
  );
};

export default AlertsWidget;
