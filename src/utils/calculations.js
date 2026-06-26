export const calculateNetWorth = (bankAccounts = [], assets = [], liabilities = []) => {
  const bankBalance = bankAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  const assetValue = assets.reduce((sum, asset) => sum + (asset.value || 0), 0);
  const liabilityTotal = liabilities.reduce((sum, liability) => sum + (liability.outstandingAmount || 0), 0);
  return bankBalance + assetValue - liabilityTotal;
};

export const calculateTotalAssets = (bankBalance = 0, creditCards = [], assets = []) => {
  let total = bankBalance;
  creditCards.forEach((card) => {
    total += card.availableCredit || 0;
  });
  assets.forEach((asset) => {
    total += asset.currentValue || 0;
  });
  return total;
};

export const calculateTotalLiabilities = (creditCards = [], liabilities = []) => {
  let total = 0;
  creditCards.forEach((card) => {
    total += card.outstandingBalance || 0;
  });
  liabilities.forEach((liability) => {
    total += liability.outstandingAmount || 0;
  });
  return total;
};

export const calculateMonthlyIncome = (income = []) => {
  return income.reduce((sum, item) => sum + (item.amount || 0), 0);
};

export const calculateMonthlyExpenses = (expenses = []) => {
  return expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
};

export const calculateCreditCardUtilization = (limitAmount, outstandingBalance) => {
  if (!limitAmount || limitAmount === 0) return 0;
  return ((outstandingBalance / limitAmount) * 100).toFixed(2);
};

export const getExpensesByCategory = (expenses = []) => {
  const categoryMap = {};
  expenses.forEach((expense) => {
    const category = expense.category || 'Other';
    categoryMap[category] = (categoryMap[category] || 0) + (expense.amount || 0);
  });
  return categoryMap;
};

export const getIncomeByCategory = (income = []) => {
  const categoryMap = {};
  income.forEach((item) => {
    const category = item.category || 'Other';
    categoryMap[category] = (categoryMap[category] || 0) + (item.amount || 0);
  });
  return categoryMap;
};

export const formatCurrency = (amount, currency = '₹') => {
  return `${currency} ${parseFloat(amount).toFixed(2)}`;
};

export const calculateUpcomingDuePayments = (creditCards = []) => {
  const { ensureDate } = require('./dateHelpers');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return creditCards
    .filter((card) => card.dueDate)
    .map((card) => {
      const dueDate = ensureDate(card.dueDate);
      if (!dueDate || isNaN(dueDate)) return null;
      const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

      return {
        ...card,
        daysUntilDue,
        isOverdue: daysUntilDue < 0,
        isDueSoon: daysUntilDue >= 0 && daysUntilDue <= 5,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue);
};

export const calculateEMIPayments = (liabilities = []) => {
  const { ensureDate } = require('./dateHelpers');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return liabilities
    .filter((liability) => liability.emiAmount && liability.emiDueDate)
    .map((liability) => {
      const dueDate = ensureDate(liability.emiDueDate);
      if (!dueDate || isNaN(dueDate)) return null;
      const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

      return {
        ...liability,
        daysUntilDue,
        isOverdue: daysUntilDue < 0,
        isDueSoon: daysUntilDue >= 0 && daysUntilDue <= 5,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue);
};

export const calculateMonthlyTrend = (income = [], expenses = [], monthCount = 12) => {
  const { ensureDate } = require('./dateHelpers');
  const months = [];
  const today = new Date();

  for (let i = monthCount - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({
      month: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
      year: date.getFullYear(),
      monthNum: date.getMonth() + 1,
      income: 0,
      expenses: 0,
    });
  }

  income.forEach((item) => {
    const itemDate = ensureDate(item.date);
    if (itemDate && !isNaN(itemDate)) {
      const monthIndex = months.findIndex(
        (m) => m.year === itemDate.getFullYear() && m.monthNum === itemDate.getMonth() + 1
      );
      if (monthIndex !== -1) {
        months[monthIndex].income += item.amount || 0;
      }
    }
  });

  expenses.forEach((item) => {
    const itemDate = ensureDate(item.date);
    if (itemDate && !isNaN(itemDate)) {
      const monthIndex = months.findIndex(
        (m) => m.year === itemDate.getFullYear() && m.monthNum === itemDate.getMonth() + 1
      );
      if (monthIndex !== -1) {
        months[monthIndex].expenses += item.amount || 0;
      }
    }
  });

  return months;
};
