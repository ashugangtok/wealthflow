import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getAllBills, addBill, updateBill, deleteBill } from '../utils/firebaseHelpers';

const BillsContext = createContext();

export const BillsProvider = ({ children }) => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBills = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getAllBills(user.uid);
      setBills(data || []);
    } catch (error) {
      console.error('Error fetching bills:', error);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addNewBill = async (billData) => {
    if (!user) return;
    try {
      await addBill(user.uid, billData);
      await fetchBills();
    } catch (error) {
      console.error('Error adding bill:', error);
      throw error;
    }
  };

  const updateBillItem = async (billId, billData) => {
    if (!user) return;
    try {
      await updateBill(user.uid, billId, billData);
      await fetchBills();
    } catch (error) {
      console.error('Error updating bill:', error);
      throw error;
    }
  };

  const deleteBillItem = async (billId) => {
    if (!user) return;
    try {
      await deleteBill(user.uid, billId);
      await fetchBills();
    } catch (error) {
      console.error('Error deleting bill:', error);
      throw error;
    }
  };

  return (
    <BillsContext.Provider value={{ bills, loading, addNewBill, updateBillItem, deleteBillItem, fetchBills }}>
      {children}
    </BillsContext.Provider>
  );
};

export const useBills = () => {
  const context = useContext(BillsContext);
  if (!context) {
    throw new Error('useBills must be used within BillsProvider');
  }
  return context;
};
