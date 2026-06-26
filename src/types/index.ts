export interface User {
  uid: string;
  email: string;
  displayName: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  settings: {
    currency: 'INR' | 'USD' | 'EUR';
    theme: 'dark' | 'light';
    notifications: boolean;
    language: 'en' | 'hi';
  };
  financialSnapshot: {
    netWorth: number;
    totalAssets: number;
    totalLiabilities: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    savingsRate: number;
  };
}

export interface Income {
  id: string;
  userId: string;
  source: 'Salary' | 'Business' | 'Freelance' | 'Rental' | 'Dividends' | 'Interest' | 'Other';
  amount: number;
  date: Date;
  description: string;
  recurring: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  userId: string;
  description: string;
  amount: number;
  date: Date;
  category: 'Food' | 'Fuel' | 'Shopping' | 'Travel' | 'Entertainment' | 'Medical' | 'Rent' | 'Utilities' | 'Education' | 'Other';
  paymentMethod: 'Cash' | 'Card' | 'UPI' | 'Bank Transfer' | 'Other';
  tags: string[];
  receipt?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  date: Date;
  category: string;
  description: string;
  source?: string;
  createdAt: Date;
}

export interface CreditCard {
  id: string;
  userId: string;
  cardName: string;
  cardNetwork: 'Visa' | 'Mastercard' | 'Amex' | 'RuPay' | 'Diners';
  limit: number;
  outstandingAmount: number;
  availableCredit: number;
  dueDate: number; // 1-31
  billingDate: number; // 1-31
  minPayment: number;
  createdAt: Date;
  lastUpdated: Date;
}

export interface CreditCardBill {
  id: string;
  userId: string;
  cardId: string;
  statementMonth: string;
  amount: number;
  dueDate: Date;
  paidAmount: number;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: Date;
}

export interface BankAccount {
  id: string;
  userId: string;
  bankName: string;
  accountType: 'Savings' | 'Current' | 'Wallet' | 'UPI' | 'Other';
  balance: number;
  accountNumber: string; // masked
  ifscCode?: string;
  createdAt: Date;
}

export interface Investment {
  id: string;
  userId: string;
  type: 'Stock' | 'MutualFund' | 'Gold' | 'FD' | 'EPF' | 'PPF' | 'NPS' | 'Crypto';
  name: string;
  currentValue: number;
  investedAmount: number;
  quantity?: number;
  purchasePrice?: number;
  currentPrice?: number;
  annualReturn: number;
  createdAt: Date;
}

export interface Asset {
  id: string;
  userId: string;
  assetName: string;
  assetType: 'Property' | 'Vehicle' | 'Gold' | 'Business' | 'Other';
  purchasePrice: number;
  currentValue: number;
  purchaseDate: Date;
  location?: string;
  createdAt: Date;
}

export interface Liability {
  id: string;
  userId: string;
  loanType: 'Home' | 'Car' | 'Personal' | 'Education' | 'Other';
  lenderName: string;
  principalAmount: number;
  outstandingAmount: number;
  interestRate: number;
  emi: number;
  remainingTenure: number; // in months
  nextEMIDate: Date;
  createdAt: Date;
}

export interface Goal {
  id: string;
  userId: string;
  goalName: string;
  goalType: 'Emergency Fund' | 'Home' | 'Trip' | 'Car' | 'Wedding' | 'Education' | 'Other';
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  serviceName: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  renewalDate: Date;
  status: 'active' | 'cancelled';
  category: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'alert' | 'reminder' | 'insight' | 'milestone';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface Report {
  id: string;
  userId: string;
  period: string;
  reportType: 'monthly' | 'quarterly' | 'yearly';
  generatedAt: Date;
  data: {
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    savingsRate: number;
    categoryBreakdown: Record<string, number>;
    netWorth: number;
  };
}

export interface FinancialHealth {
  score: number; // 0-100
  savingsRate: number;
  creditUtilization: number;
  emergencyFundMonths: number;
  debtRatio: number;
  investmentRatio: number;
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  icon: string;
  actionable: boolean;
  recommendation?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface HousePlannerData {
  targetHouseValue: number;
  currentSavings: number;
  downPaymentPercentage: number;
  targetDate: Date;
  monthlyInvestment?: number;
  estimatedEMI?: number;
  yearsToGoal?: number;
}
