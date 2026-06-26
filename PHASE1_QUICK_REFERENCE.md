# WEALTHFLOW Phase 1 - Developer Quick Reference

## 🚀 Quick Start (Copy-Paste Ready)

### 1. Add Components to Dashboard

```tsx
// src/components/Dashboard/Dashboard.tsx
import SummaryCard from './SummaryCard';
import AlertsWidget from '../Alerts/AlertsWidget';

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8">
      {/* Summary metrics at top */}
      <SummaryCard />

      {/* Grid for other content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content on left */}
        <div className="lg:col-span-2">
          {/* Your existing KPI cards and charts */}
        </div>

        {/* Alerts on right sidebar */}
        <div>
          <AlertsWidget />
        </div>
      </div>
    </div>
  );
}
```

### 2. Add Routes to App.jsx

```jsx
// src/App.jsx
import Dashboard from './components/Dashboard/Dashboard';
import BudgetModule from './components/Budget/BudgetModule';
import TransactionList from './components/Transactions/TransactionList';
import NotificationCenter from './components/Notifications/NotificationCenter';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/budgets" element={<BudgetModule />} />
        <Route path="/transactions" element={<TransactionList />} />
        <Route path="/alerts" element={<NotificationCenter />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 3. Update Sidebar Menu

```jsx
// src/components/Layout/Layout.jsx
const menuItems = [
  { label: 'Dashboard', icon: <Home size={20} />, path: '/' },
  { label: 'Budgets', icon: <TrendingDown size={20} />, path: '/budgets' },
  { label: 'Transactions', icon: <Wallet size={20} />, path: '/transactions' },
  { label: 'Alerts', icon: <Bell size={20} />, path: '/alerts' },
];
```

### 4. Add QuickAddButton to Layout

```jsx
// src/components/Layout/Layout.jsx
import QuickAddButton from '../QuickAdd/QuickAddButton';

export default function Layout() {
  return (
    <div>
      {/* Existing layout */}
      <QuickAddButton />
    </div>
  );
}
```

---

## 📦 Using Zustand Store

### Add Transactions

```tsx
import { useFinanceStore } from '../store/financeStore';

export function MyComponent() {
  const addTransaction = useFinanceStore((state) => state.addTransaction);

  const handleAddExpense = () => {
    addTransaction({
      type: 'expense',
      category: 'Food',
      description: 'Lunch',
      amount: 450,
      date: new Date(),
    });
  };

  return <button onClick={handleAddExpense}>Add Expense</button>;
}
```

### Read Transactions

```tsx
const transactions = useFinanceStore((state) => state.transactions);
const unreadAlerts = useFinanceStore((state) => state.getUnreadAlerts());
const metrics = useFinanceStore((state) => state.metrics);
```

### Calculate Metrics

```tsx
const store = useFinanceStore();

useEffect(() => {
  store.calculateMetrics();
}, [store.transactions]);

const { totalBalance, monthlySpending, healthScore } = useFinanceStore(
  (state) => state.metrics
);
```

---

## 🎨 Component Styling Patterns

### Card Pattern
```tsx
<div className="p-6 rounded-4xl bg-card/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
  {/* Content */}
</div>
```

### Button Primary
```tsx
<button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:scale-105 transition-transform">
  Button Text
</button>
```

### Input Field
```tsx
<input
  type="text"
  placeholder="Enter text..."
  className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary/50"
/>
```

### Badge
```tsx
<span className="px-3 py-1 rounded-full text-sm font-bold bg-primary/20 text-primary">
  Badge Text
</span>
```

### Grid Responsive
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Items auto-responsive */}
</div>
```

---

## 🔥 Firebase Quick Setup

### Create Firestore Collections

```javascript
// In Firebase Console or with code:

// Transactions
db.collection('users').doc(userId).collection('transactions').add({
  type: 'expense',
  amount: 450,
  category: 'Food',
  description: 'Lunch',
  date: new Date(),
  createdAt: serverTimestamp(),
})

// Budgets
db.collection('users').doc(userId).collection('budgets').add({
  category: 'Food',
  limit: 5000,
  period: 'monthly',
  createdAt: serverTimestamp(),
})

// Alerts
db.collection('users').doc(userId).collection('alerts').add({
  type: 'budget',
  severity: 'warning',
  title: 'Budget Alert',
  message: 'You exceeded your budget',
  read: false,
  createdAt: serverTimestamp(),
})
```

### Firestore Security Rules

```javascript
// Copy this to Firestore Rules:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      match /{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

---

## 📊 Common Data Operations

### Get Monthly Spending

```tsx
const store = useFinanceStore();

const getMonthlySpending = () => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return store.transactions
    .filter(t => t.type === 'expense' && new Date(t.date) >= monthStart)
    .reduce((sum, t) => sum + t.amount, 0);
};
```

### Get Transactions by Category

```tsx
const foodExpenses = useFinanceStore((state) =>
  state.getTransactionsByCategory('Food')
);

const total = foodExpenses.reduce((sum, t) => sum + t.amount, 0);
```

### Filter by Date Range

```tsx
const start = new Date('2026-01-01');
const end = new Date('2026-01-31');

const monthTransactions = useFinanceStore((state) =>
  state.getTransactionsByDateRange(start, end)
);
```

### Get Budget Utilization

```tsx
const utilization = useFinanceStore((state) =>
  state.calculateBudgetUtilization('budget_123')
);

// Returns 0-100 percentage
```

---

## 🎯 Real-time Firebase Queries

### Listen to Transactions

```tsx
import { doc, collection, query, onSnapshot } from 'firebase/firestore';

useEffect(() => {
  const q = query(
    collection(db, 'users', userId, 'transactions'),
    orderBy('date', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setTransactions(transactions);
  });

  return unsubscribe;
}, [userId]);
```

### Listen to Budgets

```tsx
useEffect(() => {
  const q = query(
    collection(db, 'users', userId, 'budgets'),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const budgets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    updateFinanceStore(budgets);
  });

  return unsubscribe;
}, [userId]);
```

---

## ⚡ Performance Tips

### Debounce Search
```tsx
import { useMemo } from 'react';

const handleSearch = (query) => {
  const filtered = useMemo(() => {
    return transactions.filter(t =>
      t.description.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, transactions]);
};
```

### Lazy Load Components
```tsx
const BudgetModule = lazy(() => import('./Budget/BudgetModule'));

<Suspense fallback={<Skeleton />}>
  <BudgetModule />
</Suspense>
```

### Memoize Expensive Components
```tsx
const TransactionRow = memo(({ transaction, onDelete }) => {
  return (
    <div>
      {/* Expensive rendering */}
    </div>
  );
}, (prev, next) => prev.transaction.id === next.transaction.id);
```

---

## 🧪 Testing Examples

### Test Budget Calculation
```tsx
import { renderHook, act } from '@testing-library/react';
import { useFinanceStore } from '../store/financeStore';

test('should calculate budget utilization', () => {
  const { result } = renderHook(() => useFinanceStore());

  act(() => {
    result.current.addBudget({
      category: 'Food',
      limit: 5000,
      spent: 3500,
      period: 'monthly',
    });
  });

  const utilization = result.current.calculateBudgetUtilization(budgetId);
  expect(utilization).toBe(70);
});
```

### Test Transaction Filtering
```tsx
test('should filter transactions by category', () => {
  const { result } = renderHook(() => useFinanceStore());

  act(() => {
    result.current.addTransaction({
      type: 'expense',
      category: 'Food',
      amount: 450,
      date: new Date(),
      description: 'Lunch',
    });
  });

  const foodExpenses = result.current.getTransactionsByCategory('Food');
  expect(foodExpenses).toHaveLength(1);
  expect(foodExpenses[0].amount).toBe(450);
});
```

---

## 🚨 Error Handling

### Handle Firebase Errors

```tsx
const handleAddBudget = async () => {
  try {
    await db.collection('users').doc(userId).collection('budgets').add({
      // Data
    });
  } catch (error) {
    if (error.code === 'permission-denied') {
      showError('You don\'t have permission to add budgets');
    } else if (error.code === 'invalid-argument') {
      showError('Invalid budget data');
    } else {
      showError('Failed to add budget');
    }
  }
};
```

### Handle Validation

```tsx
const validateBudget = (budget) => {
  const errors = {};

  if (!budget.category) {
    errors.category = 'Category is required';
  }

  if (budget.limit <= 0) {
    errors.limit = 'Budget must be greater than 0';
  }

  return Object.keys(errors).length === 0 ? null : errors;
};
```

---

## 📱 Mobile Optimization Checklist

- [x] All buttons are 44x44px minimum
- [x] Modals are full-screen on mobile
- [x] Forms are single column on mobile
- [x] Touch-friendly spacing
- [x] No horizontal scrolling
- [x] Fast interactions (< 200ms)
- [x] Text is readable (16px minimum)

---

## 🔗 Component Dependencies

```
App
├── Layout
│   ├── Sidebar (Menu)
│   ├── Main Content
│   │   ├── Dashboard
│   │   │   ├── SummaryCard
│   │   │   ├── KPI Cards
│   │   │   └── AlertsWidget
│   │   ├── BudgetModule
│   │   ├── TransactionList
│   │   └── NotificationCenter
│   └── QuickAddButton
├── financeStore (Zustand)
├── useAuth (AuthContext)
└── Firebase
    ├── Firestore
    ├── Authentication
    └── Cloud Functions
```

---

## 💡 Debugging Tips

### Log Store State
```tsx
const state = useFinanceStore();
console.log('Store state:', state);
```

### Monitor Firebase Queries
```tsx
// In Firebase Console → Firestore → Usage tab
// Watch real-time query patterns
```

### Check Component Renders
```tsx
useEffect(() => {
  console.log('Component mounted/updated');
  return () => console.log('Component unmounted');
}, []);
```

### Firestore Emulator
```bash
firebase emulator:start
# Then connect to localhost:8080
```

---

## 🎓 Learning Resources

- **React:** [React Docs](https://react.dev)
- **TypeScript:** [TS Handbook](https://www.typescriptlang.org/docs/)
- **Tailwind:** [Tailwind Docs](https://tailwindcss.com/docs)
- **Firebase:** [Firebase Docs](https://firebase.google.com/docs)
- **Zustand:** [Zustand Docs](https://github.com/pmndrs/zustand)

---

## ✅ Pre-commit Checklist

Before pushing code:

```bash
# Format code
npm run format

# Run linter
npm run lint

# Run tests
npm run test

# Build check
npm run build

# Commit
git add .
git commit -m "Phase 1: [Your changes]"
git push
```

---

## 📞 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Components not updating | Check if Zustand selector is correct |
| Firebase 403 error | Update Firestore rules |
| Real-time listeners not working | Check collection exists in Firestore |
| Styling looks wrong | Verify Tailwind config loaded |
| QuickAdd not working | Check user is authenticated |
| Slow queries | Add Firestore composite indexes |

---

## 🎯 Next Steps

1. **Integrate Components** (Today)
   - Update App.jsx routes
   - Wire QuickAddButton
   - Add to Dashboard

2. **Firebase Setup** (Tomorrow)
   - Create collections
   - Set up rules
   - Create indexes

3. **Cloud Functions** (This Week)
   - Deploy all 4 functions
   - Test each function
   - Monitor logs

4. **Testing** (Next Week)
   - Unit tests
   - Integration tests
   - E2E tests

5. **Launch** (Week 2)
   - Build & deploy
   - Monitor performance
   - Gather feedback

---

**Ready to code? Let's ship Phase 1! 🚀**

*Last Updated: June 25, 2026*
*Version: 1.0*
