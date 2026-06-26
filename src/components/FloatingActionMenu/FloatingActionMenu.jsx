import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, BarChart3, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuickActions } from '../../context/QuickActionsContext';

export const FloatingActionMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { openIncomeModal, openExpenseModal } = useQuickActions();

  const actions = [
    {
      label: 'Add Income',
      icon: TrendingUp,
      action: openIncomeModal,
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Add Expense',
      icon: TrendingDown,
      action: openExpenseModal,
      color: 'from-pink-500 to-rose-500',
    },
    {
      label: 'Add Bill',
      icon: Receipt,
      action: () => navigate('/bills'),
      color: 'from-orange-500 to-amber-500',
    },
    {
      label: 'View Reports',
      icon: BarChart3,
      action: () => navigate('/reports'),
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  const handleActionClick = (action) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-40">
      {/* Action Buttons */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 flex flex-col gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => handleActionClick(action.action)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r ${action.color} text-white font-semibold shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200`}
                style={{
                  animation: `slideUp 0.3s ease-out ${index * 0.1}s both`,
                }}
              >
                <Icon size={18} />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Plus Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center ${
          isOpen ? 'scale-110 rotate-45' : 'scale-100 rotate-0'
        }`}
      >
        <Plus size={28} strokeWidth={3} />
      </button>
    </div>
  );
};

export default FloatingActionMenu;
