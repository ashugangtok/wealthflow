import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Income operations
export const addIncome = async (userId, incomeData) => {
  return addDoc(collection(db, 'users', userId, 'income'), {
    ...incomeData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const updateIncome = async (userId, incomeId, incomeData) => {
  return updateDoc(doc(db, 'users', userId, 'income', incomeId), {
    ...incomeData,
    updatedAt: new Date(),
  });
};

export const deleteIncome = async (userId, incomeId) => {
  return deleteDoc(doc(db, 'users', userId, 'income', incomeId));
};

export const getIncomeByMonth = async (userId, year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const q = query(
    collection(db, 'users', userId, 'income'),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getAllIncome = async (userId) => {
  try {
    const q = query(
      collection(db, 'users', userId, 'income'),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    // Fallback if orderBy fails (e.g., no index exists)
    const snapshot = await getDocs(collection(db, 'users', userId, 'income'));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    // Sort by date in memory
    return data.sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date : new Date(a.date);
      const dateB = b.date instanceof Date ? b.date : new Date(b.date);
      return dateB - dateA;
    });
  }
};

// Expense operations
export const addExpense = async (userId, expenseData) => {
  return addDoc(collection(db, 'users', userId, 'expenses'), {
    ...expenseData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const updateExpense = async (userId, expenseId, expenseData) => {
  return updateDoc(doc(db, 'users', userId, 'expenses', expenseId), {
    ...expenseData,
    updatedAt: new Date(),
  });
};

export const deleteExpense = async (userId, expenseId) => {
  return deleteDoc(doc(db, 'users', userId, 'expenses', expenseId));
};

export const getExpenseByMonth = async (userId, year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const q = query(
    collection(db, 'users', userId, 'expenses'),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getAllExpenses = async (userId) => {
  try {
    const q = query(
      collection(db, 'users', userId, 'expenses'),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    // Fallback if orderBy fails (e.g., no index exists)
    const snapshot = await getDocs(collection(db, 'users', userId, 'expenses'));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    // Sort by date in memory
    return data.sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date : new Date(a.date);
      const dateB = b.date instanceof Date ? b.date : new Date(b.date);
      return dateB - dateA;
    });
  }
};

// Credit Card operations
export const addCreditCard = async (userId, cardData) => {
  return addDoc(collection(db, 'users', userId, 'creditCards'), {
    ...cardData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const updateCreditCard = async (userId, cardId, cardData) => {
  return updateDoc(doc(db, 'users', userId, 'creditCards', cardId), {
    ...cardData,
    updatedAt: new Date(),
  });
};

export const deleteCreditCard = async (userId, cardId) => {
  return deleteDoc(doc(db, 'users', userId, 'creditCards', cardId));
};

export const getAllCreditCards = async (userId) => {
  const snapshot = await getDocs(collection(db, 'users', userId, 'creditCards'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Bank Account operations
export const addBankAccount = async (userId, accountData) => {
  return addDoc(collection(db, 'users', userId, 'bankAccounts'), {
    ...accountData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const updateBankAccount = async (userId, accountId, accountData) => {
  return updateDoc(doc(db, 'users', userId, 'bankAccounts', accountId), {
    ...accountData,
    updatedAt: new Date(),
  });
};

export const deleteBankAccount = async (userId, accountId) => {
  return deleteDoc(doc(db, 'users', userId, 'bankAccounts', accountId));
};

export const getAllBankAccounts = async (userId) => {
  const snapshot = await getDocs(collection(db, 'users', userId, 'bankAccounts'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Asset operations
export const addAsset = async (userId, assetData) => {
  return addDoc(collection(db, 'users', userId, 'assets'), {
    ...assetData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const updateAsset = async (userId, assetId, assetData) => {
  return updateDoc(doc(db, 'users', userId, 'assets', assetId), {
    ...assetData,
    updatedAt: new Date(),
  });
};

export const deleteAsset = async (userId, assetId) => {
  return deleteDoc(doc(db, 'users', userId, 'assets', assetId));
};

export const getAllAssets = async (userId) => {
  const snapshot = await getDocs(collection(db, 'users', userId, 'assets'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Liability operations
export const addLiability = async (userId, liabilityData) => {
  return addDoc(collection(db, 'users', userId, 'liabilities'), {
    ...liabilityData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const updateLiability = async (userId, liabilityId, liabilityData) => {
  return updateDoc(doc(db, 'users', userId, 'liabilities', liabilityId), {
    ...liabilityData,
    updatedAt: new Date(),
  });
};

export const deleteLiability = async (userId, liabilityId) => {
  return deleteDoc(doc(db, 'users', userId, 'liabilities', liabilityId));
};

export const getAllLiabilities = async (userId) => {
  const snapshot = await getDocs(collection(db, 'users', userId, 'liabilities'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Liability Payment records
export const addLiabilityPayment = async (userId, paymentData) => {
  return addDoc(collection(db, 'users', userId, 'liabilityPayments'), {
    ...paymentData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const getAllLiabilityPayments = async (userId) => {
  try {
    const q = query(
      collection(db, 'users', userId, 'liabilityPayments'),
      orderBy('paymentDate', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    const snapshot = await getDocs(collection(db, 'users', userId, 'liabilityPayments'));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return data.sort((a, b) => {
      const dateA = a.paymentDate instanceof Date ? a.paymentDate : new Date(a.paymentDate);
      const dateB = b.paymentDate instanceof Date ? b.paymentDate : new Date(b.paymentDate);
      return dateB - dateA;
    });
  }
};

// Budget operations
export const addBudget = async (userId, budgetData) => {
  return addDoc(collection(db, 'users', userId, 'budgets'), {
    ...budgetData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const updateBudget = async (userId, budgetId, budgetData) => {
  return updateDoc(doc(db, 'users', userId, 'budgets', budgetId), {
    ...budgetData,
    updatedAt: new Date(),
  });
};

export const deleteBudget = async (userId, budgetId) => {
  return deleteDoc(doc(db, 'users', userId, 'budgets', budgetId));
};

export const getAllBudgets = async (userId) => {
  const snapshot = await getDocs(collection(db, 'users', userId, 'budgets'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Savings Goals operations
export const addGoal = async (userId, goalData) => {
  return addDoc(collection(db, 'users', userId, 'savingsGoals'), {
    ...goalData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const updateGoal = async (userId, goalId, goalData) => {
  return updateDoc(doc(db, 'users', userId, 'savingsGoals', goalId), {
    ...goalData,
    updatedAt: new Date(),
  });
};

export const deleteGoal = async (userId, goalId) => {
  return deleteDoc(doc(db, 'users', userId, 'savingsGoals', goalId));
};

export const getAllGoals = async (userId) => {
  const snapshot = await getDocs(collection(db, 'users', userId, 'savingsGoals'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Subscriptions operations
export const addSubscription = async (userId, subscriptionData) => {
  return addDoc(collection(db, 'users', userId, 'subscriptions'), {
    ...subscriptionData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const updateSubscription = async (userId, subscriptionId, subscriptionData) => {
  return updateDoc(doc(db, 'users', userId, 'subscriptions', subscriptionId), {
    ...subscriptionData,
    updatedAt: new Date(),
  });
};

export const deleteSubscription = async (userId, subscriptionId) => {
  return deleteDoc(doc(db, 'users', userId, 'subscriptions', subscriptionId));
};

export const getAllSubscriptions = async (userId) => {
  const snapshot = await getDocs(collection(db, 'users', userId, 'subscriptions'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Bills/Recurring Payments operations
export const addBill = async (userId, billData) => {
  return addDoc(collection(db, 'users', userId, 'bills'), {
    ...billData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const updateBill = async (userId, billId, billData) => {
  return updateDoc(doc(db, 'users', userId, 'bills', billId), {
    ...billData,
    updatedAt: new Date(),
  });
};

export const deleteBill = async (userId, billId) => {
  return deleteDoc(doc(db, 'users', userId, 'bills', billId));
};

export const getAllBills = async (userId) => {
  try {
    const q = query(
      collection(db, 'users', userId, 'bills'),
      orderBy('billDate', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    const snapshot = await getDocs(collection(db, 'users', userId, 'bills'));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return data.sort((a, b) => {
      const dateA = a.billDate instanceof Date ? a.billDate : new Date(a.billDate);
      const dateB = b.billDate instanceof Date ? b.billDate : new Date(b.billDate);
      return dateB - dateA;
    });
  }
};
