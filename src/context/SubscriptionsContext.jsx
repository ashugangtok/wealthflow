import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { addSubscription, updateSubscription, deleteSubscription, getAllSubscriptions } from '../utils/firebaseHelpers';

const SubscriptionsContext = createContext();

export const SubscriptionsProvider = ({ children }) => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscriptions();
    } else {
      setSubscriptions([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await getAllSubscriptions(user.uid);
      setSubscriptions(data);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const addSubscriptionItem = async (subscriptionData) => {
    try {
      const docRef = await addSubscription(user.uid, subscriptionData);
      setSubscriptions([...subscriptions, { id: docRef.id, ...subscriptionData }]);
    } catch (error) {
      console.error('Error adding subscription:', error);
      throw error;
    }
  };

  const updateSubscriptionItem = async (id, updates) => {
    try {
      await updateSubscription(user.uid, id, updates);
      setSubscriptions(subscriptions.map((sub) =>
        sub.id === id ? { ...sub, ...updates } : sub
      ));
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  };

  const deleteSubscriptionItem = async (id) => {
    try {
      await deleteSubscription(user.uid, id);
      setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
    } catch (error) {
      console.error('Error deleting subscription:', error);
      throw error;
    }
  };

  const value = {
    subscriptions,
    loading,
    addSubscriptionItem,
    updateSubscriptionItem,
    deleteSubscriptionItem,
  };

  return (
    <SubscriptionsContext.Provider value={value}>
      {children}
    </SubscriptionsContext.Provider>
  );
};

export const useSubscriptions = () => {
  const context = useContext(SubscriptionsContext);
  if (!context) {
    throw new Error('useSubscriptions must be used within SubscriptionsProvider');
  }
  return context;
};
