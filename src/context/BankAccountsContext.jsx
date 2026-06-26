import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  addBankAccount,
  updateBankAccount,
  deleteBankAccount,
  getAllBankAccounts,
} from '../utils/firebaseHelpers';

const BankAccountsContext = createContext();

export const BankAccountsProvider = ({ children }) => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAccounts();
    } else {
      setAccounts([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const data = await getAllBankAccounts(user.uid);
      setAccounts(data);
    } catch (error) {
      console.error('Error loading bank accounts:', error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const addAccount = async (account) => {
    try {
      const docRef = await addBankAccount(user.uid, account);
      setAccounts([...accounts, { id: docRef.id, ...account }]);
    } catch (error) {
      console.error('Error adding account:', error);
      throw error;
    }
  };

  const updateAccount = async (id, updates) => {
    try {
      await updateBankAccount(user.uid, id, updates);
      setAccounts(accounts.map((acc) =>
        acc.id === id ? { ...acc, ...updates } : acc
      ));
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  };

  const deleteAccount = async (id) => {
    try {
      await deleteBankAccount(user.uid, id);
      setAccounts(accounts.filter((acc) => acc.id !== id));
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  };

  const updateAccountBalance = async (id, newBalance) => {
    try {
      await updateBankAccount(user.uid, id, { balance: newBalance });
      setAccounts(accounts.map((acc) =>
        acc.id === id ? { ...acc, balance: newBalance } : acc
      ));
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  };

  const getAccountById = (id) => {
    return accounts.find((acc) => acc.id === id);
  };

  const value = {
    accounts,
    loading,
    addAccount,
    updateAccount,
    deleteAccount,
    updateAccountBalance,
    getAccountById,
  };

  return (
    <BankAccountsContext.Provider value={value}>
      {children}
    </BankAccountsContext.Provider>
  );
};

export const useBankAccounts = () => {
  const context = useContext(BankAccountsContext);
  if (!context) {
    throw new Error('useBankAccounts must be used within BankAccountsProvider');
  }
  return context;
};
