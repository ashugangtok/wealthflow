import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  addCreditCard,
  updateCreditCard,
  deleteCreditCard,
  getAllCreditCards,
} from '../utils/firebaseHelpers';

const CreditCardsContext = createContext();

export const CreditCardsProvider = ({ children }) => {
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCards();
    } else {
      setCards([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadCards = async () => {
    try {
      setLoading(true);
      const data = await getAllCreditCards(user.uid);
      setCards(data);
    } catch (error) {
      console.error('Error loading credit cards:', error);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const addCard = async (cardData) => {
    try {
      const docRef = await addCreditCard(user.uid, cardData);
      setCards([...cards, { id: docRef.id, ...cardData }]);
    } catch (error) {
      console.error('Error adding card:', error);
      throw error;
    }
  };

  const updateCard = async (id, updates) => {
    try {
      await updateCreditCard(user.uid, id, updates);
      setCards(cards.map((card) =>
        card.id === id ? { ...card, ...updates } : card
      ));
    } catch (error) {
      console.error('Error updating card:', error);
      throw error;
    }
  };

  const deleteCard = async (id) => {
    try {
      await deleteCreditCard(user.uid, id);
      setCards(cards.filter((card) => card.id !== id));
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  };

  const updateOutstandingBalance = async (id, newBalance) => {
    try {
      await updateCreditCard(user.uid, id, { outstandingBalance: newBalance });
      setCards(cards.map((card) =>
        card.id === id ? { ...card, outstandingBalance: newBalance } : card
      ));
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  };

  const getCardById = (id) => {
    return cards.find((card) => card.id === id);
  };

  const value = {
    cards,
    loading,
    addCard,
    updateCard,
    deleteCard,
    updateOutstandingBalance,
    getCardById,
  };

  return (
    <CreditCardsContext.Provider value={value}>
      {children}
    </CreditCardsContext.Provider>
  );
};

export const useCreditCards = () => {
  const context = useContext(CreditCardsContext);
  if (!context) {
    throw new Error('useCreditCards must be used within CreditCardsProvider');
  }
  return context;
};
