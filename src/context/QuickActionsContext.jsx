import React, { createContext, useState, useContext } from 'react';

const QuickActionsContext = createContext();

export const QuickActionsProvider = ({ children }) => {
  const [openModal, setOpenModal] = useState(null); // null, 'income', 'expense'

  const openIncomeModal = () => setOpenModal('income');
  const openExpenseModal = () => setOpenModal('expense');
  const closeModal = () => setOpenModal(null);

  const value = {
    openModal,
    openIncomeModal,
    openExpenseModal,
    closeModal,
  };

  return (
    <QuickActionsContext.Provider value={value}>
      {children}
    </QuickActionsContext.Provider>
  );
};

export const useQuickActions = () => {
  const context = useContext(QuickActionsContext);
  if (!context) {
    throw new Error('useQuickActions must be used within QuickActionsProvider');
  }
  return context;
};
