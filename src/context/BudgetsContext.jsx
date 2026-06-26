import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { addBudget, updateBudget, deleteBudget, getAllBudgets } from '../utils/firebaseHelpers';

const BudgetsContext = createContext();

export const BudgetsProvider = ({ children }) => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBudgets();
    } else {
      setBudgets([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadBudgets = async () => {
    try {
      setLoading(true);
      const data = await getAllBudgets(user.uid);
      setBudgets(data);
    } catch (error) {
      console.error('Error loading budgets:', error);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  const addBudgetItem = async (budgetData) => {
    try {
      const docRef = await addBudget(user.uid, budgetData);
      setBudgets([...budgets, { id: docRef.id, ...budgetData }]);
    } catch (error) {
      console.error('Error adding budget:', error);
      throw error;
    }
  };

  const updateBudgetItem = async (id, updates) => {
    try {
      await updateBudget(user.uid, id, updates);
      setBudgets(budgets.map((budget) =>
        budget.id === id ? { ...budget, ...updates } : budget
      ));
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  };

  const deleteBudgetItem = async (id) => {
    try {
      await deleteBudget(user.uid, id);
      setBudgets(budgets.filter((budget) => budget.id !== id));
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  };

  const value = {
    budgets,
    loading,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
  };

  return (
    <BudgetsContext.Provider value={value}>
      {children}
    </BudgetsContext.Provider>
  );
};

export const useBudgets = () => {
  const context = useContext(BudgetsContext);
  if (!context) {
    throw new Error('useBudgets must be used within BudgetsProvider');
  }
  return context;
};
