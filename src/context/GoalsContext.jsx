import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { addGoal, updateGoal, deleteGoal, getAllGoals } from '../utils/firebaseHelpers';

const GoalsContext = createContext();

export const GoalsProvider = ({ children }) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadGoals();
    } else {
      setGoals([]);
      setLoading(false);
    }
  }, [user]);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await getAllGoals(user.uid);
      setGoals(data);
    } catch (error) {
      console.error('Error loading goals:', error);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const addGoalItem = async (goalData) => {
    try {
      const docRef = await addGoal(user.uid, goalData);
      setGoals([...goals, { id: docRef.id, ...goalData }]);
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    }
  };

  const updateGoalItem = async (id, updates) => {
    try {
      await updateGoal(user.uid, id, updates);
      setGoals(goals.map((goal) =>
        goal.id === id ? { ...goal, ...updates } : goal
      ));
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  };

  const deleteGoalItem = async (id) => {
    try {
      await deleteGoal(user.uid, id);
      setGoals(goals.filter((goal) => goal.id !== id));
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  };

  const value = {
    goals,
    loading,
    addGoalItem,
    updateGoalItem,
    deleteGoalItem,
  };

  return (
    <GoalsContext.Provider value={value}>
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals must be used within GoalsProvider');
  }
  return context;
};
