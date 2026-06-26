# BudgetTracker Integration Guide

## Quick Start Integration

### 1. Import the Component

```typescript
// In your page/route component
import BudgetTracker from '@/components/Budget/BudgetTracker';
import { BudgetItem } from '@/components/Budget/BudgetTracker';
```

### 2. Setup Sample Data

```typescript
const [budgets, setBudgets] = useState<BudgetItem[]>([
  {
    id: '1',
    name: 'Monthly Groceries',
    category: 'groceries',
    spent: 4200,
    limit: 6000,
    period: 'monthly',
  },
  // ... more budgets
]);
```

### 3. Add Handler Functions

```typescript
const handleEditBudget = (budgetId: string) => {
  // Navigate to edit form or open modal
  console.log('Editing budget:', budgetId);
};

const handleDeleteBudget = (budgetId: string) => {
  // Call API to delete
  setBudgets(budgets.filter(b => b.id !== budgetId));
};
```

### 4. Render Component

```typescript
<BudgetTracker
  budgets={budgets}
  onEditBudget={handleEditBudget}
  onDeleteBudget={handleDeleteBudget}
  compact={false}
  showActions={true}
/>
```

---

## Integration with Existing BudgetModule

### Option A: Replace BudgetModule

```typescript
// budgets/page.tsx
import BudgetTracker from '@/components/Budget/BudgetTracker';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);

  // Fetch from Firebase
  useEffect(() => {
    const unsubscribe = db
      .collection(`users/${userId}/budgets`)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as BudgetItem[];
        setBudgets(data);
      });
    return unsubscribe;
  }, [userId]);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">My Budgets</h1>
      <BudgetTracker
        budgets={budgets}
        onEditBudget={handleEdit}
        onDeleteBudget={handleDelete}
      />
    </div>
  );
}
```

### Option B: Enhance BudgetModule

```typescript
// BudgetModule.tsx
import BudgetTracker from './BudgetTracker';

export const BudgetModule: React.FC = () => {
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);

  // ... existing code ...

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card/20 p-8">
      {/* Existing header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Budgets</h1>
          <p className="text-white/60">Manage your spending limits</p>
        </div>
        <button>Add Budget</button>
      </div>

      {/* New BudgetTracker Component */}
      <BudgetTracker
        budgets={budgets}
        onEditBudget={handleEdit}
        onDeleteBudget={handleDelete}
        showActions={true}
      />

      {/* Existing modal */}
      {isModalOpen && (/* ... */)}
    </div>
  );
};
```

---

## Integration with Zustand Store

### Update financeStore.ts

```typescript
// src/store/financeStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface BudgetItem {
  id: string;
  name: string;
  category: string;
  spent: number;
  limit: number;
  period: 'monthly' | 'yearly';
}

interface FinanceStore {
  budgets: BudgetItem[];
  
  // Budget actions
  setBudgets: (budgets: BudgetItem[]) => void;
  addBudget: (budget: BudgetItem) => void;
  updateBudget: (id: string, budget: Partial<BudgetItem>) => void;
  deleteBudget: (id: string) => void;
  
  // Computed
  getBudgetStats: () => {
    totalSpent: number;
    totalLimit: number;
    onTrack: number;
    warning: number;
    overBudget: number;
  };
}

export const useFinanceStore = create<FinanceStore>()(
  devtools((set, get) => ({
    budgets: [],
    
    setBudgets: (budgets) => set({ budgets }),
    
    addBudget: (budget) =>
      set((state) => ({
        budgets: [...state.budgets, budget],
      })),
    
    updateBudget: (id, updates) =>
      set((state) => ({
        budgets: state.budgets.map((b) =>
          b.id === id ? { ...b, ...updates } : b
        ),
      })),
    
    deleteBudget: (id) =>
      set((state) => ({
        budgets: state.budgets.filter((b) => b.id !== id),
      })),
    
    getBudgetStats: () => {
      const budgets = get().budgets;
      const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
      const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
      
      return {
        totalSpent,
        totalLimit,
        onTrack: budgets.filter(b => (b.spent / b.limit) < 0.75).length,
        warning: budgets.filter(b => (b.spent / b.limit) >= 0.75 && b.spent <= b.limit).length,
        overBudget: budgets.filter(b => b.spent > b.limit).length,
      };
    },
  }))
);
```

### Use Store in Component

```typescript
import { useFinanceStore } from '@/store/financeStore';

export default function BudgetsPage() {
  const { budgets, deleteBudget, updateBudget } = useFinanceStore();

  useEffect(() => {
    // Fetch budgets on mount
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    const data = await db.collection(`users/${userId}/budgets`).getDocs();
    const budgetList = data.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as BudgetItem[];
    useFinanceStore.setState({ budgets: budgetList });
  };

  return (
    <BudgetTracker
      budgets={budgets}
      onEditBudget={(id) => {
        // Navigate to edit
      }}
      onDeleteBudget={deleteBudget}
    />
  );
}
```

---

## Integration with Firebase Firestore

### Fetch Real Budget Data

```typescript
import { db } from '@/firebase/config';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

useEffect(() => {
  if (!userId) return;

  const budgetsRef = collection(db, 'users', userId, 'budgets');
  const q = query(budgetsRef, where('active', '==', true));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const budgetList: BudgetItem[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      category: doc.data().category,
      spent: doc.data().spent,
      limit: doc.data().limit,
      period: doc.data().period,
    }));

    setBudgets(budgetList);
  });

  return unsubscribe;
}, [userId]);
```

### Update Budget Spending

```typescript
// When transaction is added/updated
const updateBudgetSpent = async (budgetId: string, amount: number) => {
  const budgetRef = doc(db, 'users', userId, 'budgets', budgetId);
  const budgetSnap = await getDoc(budgetRef);
  
  if (budgetSnap.exists()) {
    await updateDoc(budgetRef, {
      spent: budgetSnap.data().spent + amount,
      lastUpdated: new Date(),
    });
  }
};
```

### Delete Budget

```typescript
const handleDeleteBudget = async (budgetId: string) => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'budgets', budgetId));
    setBudgets(budgets.filter(b => b.id !== budgetId));
  } catch (error) {
    console.error('Error deleting budget:', error);
  }
};
```

---

## Integration with Dashboard

### Show Top 3 Budgets in Compact Mode

```typescript
// components/Dashboard/Dashboard.tsx
import BudgetTracker from '@/components/Budget/BudgetTracker';

export default function Dashboard() {
  const { budgets } = useFinanceStore();
  
  // Get top 3 budgets by spending
  const topBudgets = budgets
    .sort((a, b) => (b.spent / b.limit) - (a.spent / a.limit))
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <SummaryCard />
      
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Top Budgets</h2>
        <BudgetTracker
          budgets={topBudgets}
          compact={true}
          showActions={false}
        />
      </div>
      
      <QuickAddButton />
    </div>
  );
}
```

---

## Integration with Budget Edit Modal

### Create Edit Modal

```typescript
// components/Budget/BudgetEditModal.tsx
interface BudgetEditModalProps {
  budget: BudgetItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (budget: BudgetItem) => void;
}

export const BudgetEditModal: React.FC<BudgetEditModalProps> = ({
  budget,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState(budget || {});

  const handleSave = async () => {
    try {
      const budgetRef = doc(db, 'users', userId, 'budgets', budget!.id);
      await updateDoc(budgetRef, formData);
      onSave(formData as BudgetItem);
      onClose();
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  // Form JSX...
};
```

### Use in Page

```typescript
export default function BudgetsPage() {
  const [editingBudget, setEditingBudget] = useState<BudgetItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditBudget = (budgetId: string) => {
    const budget = budgets.find(b => b.id === budgetId);
    setEditingBudget(budget || null);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <BudgetTracker
        budgets={budgets}
        onEditBudget={handleEditBudget}
        onDeleteBudget={handleDeleteBudget}
      />
      
      <BudgetEditModal
        budget={editingBudget}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(updated) => {
          const newBudgets = budgets.map(b =>
            b.id === updated.id ? updated : b
          );
          setBudgets(newBudgets);
        }}
      />
    </>
  );
}
```

---

## Integration with TransactionList

### Sync Spending on Transaction Add

```typescript
const handleAddTransaction = async (transaction: Transaction) => {
  try {
    // Save transaction
    await db.collection(`users/${userId}/transactions`).add(transaction);
    
    // Update associated budget
    if (transaction.budgetId) {
      await updateBudgetSpent(transaction.budgetId, transaction.amount);
    }
  } catch (error) {
    console.error('Error adding transaction:', error);
  }
};
```

---

## Integration with Alerts System

### Create Budget Alerts

```typescript
// When budget spent reaches 75% or exceeds limit
const checkBudgetStatus = (budget: BudgetItem) => {
  const percentage = (budget.spent / budget.limit) * 100;
  
  if (percentage >= 100) {
    createAlert({
      type: 'error',
      title: 'Budget Exceeded',
      message: `${budget.name} budget has been exceeded by ₹${(budget.spent - budget.limit).toLocaleString()}`,
      budgetId: budget.id,
    });
  } else if (percentage >= 75) {
    createAlert({
      type: 'warning',
      title: 'Budget Warning',
      message: `${budget.name} is at ${percentage.toFixed(0)}% of your limit`,
      budgetId: budget.id,
    });
  }
};
```

---

## Styling Customization

### Tailwind Configuration

Ensure your `tailwind.config.ts` includes:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',    // Violet
        secondary: '#06B6D4',  // Cyan
        success: '#10B981',    // Green
        warning: '#F59E0B',    // Amber
        danger: '#EF4444',     // Red
      },
    },
  },
};
```

### Dark Mode Setup

```typescript
// tailwind.config.ts
{
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0f172a',  // slate-950
        card: '#1e293b',        // slate-800
      },
    },
  },
}
```

---

## Performance Optimization

### Memoize Component

```typescript
import { memo } from 'react';

const MemoizedBudgetTracker = memo(BudgetTracker, (prev, next) => {
  // Prevent re-render if budgets array reference hasn't changed
  return prev.budgets === next.budgets &&
         prev.compact === next.compact &&
         prev.showActions === next.showActions;
});

export default MemoizedBudgetTracker;
```

### Virtual Scrolling (for large lists)

```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={budgets.length}
  itemSize={350}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <BudgetCard
        budget={budgets[index]}
        // ... props
      />
    </div>
  )}
</FixedSizeList>
```

---

## Testing

### Unit Test Example

```typescript
// BudgetTracker.test.tsx
import { render, screen } from '@testing-library/react';
import BudgetTracker from './BudgetTracker';

describe('BudgetTracker', () => {
  it('displays budget items', () => {
    const budgets = [
      {
        id: '1',
        name: 'Groceries',
        category: 'groceries',
        spent: 2000,
        limit: 5000,
        period: 'monthly' as const,
      },
    ];

    render(<BudgetTracker budgets={budgets} />);
    
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('₹2,000')).toBeInTheDocument();
  });

  it('shows warning status at 75%+', () => {
    const budgets = [
      {
        id: '1',
        name: 'Test',
        category: 'food',
        spent: 3750,
        limit: 5000,
        period: 'monthly' as const,
      },
    ];

    render(<BudgetTracker budgets={budgets} />);
    
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });
});
```

---

## Migration Checklist

- [ ] Copy BudgetTracker.tsx to components/Budget/
- [ ] Update imports in BudgetModule.tsx
- [ ] Add BudgetItem type definitions
- [ ] Setup Firestore collection listeners
- [ ] Update edit/delete handlers
- [ ] Test with real Firebase data
- [ ] Add to Dashboard in compact mode
- [ ] Setup budget alerts
- [ ] Test responsive layout
- [ ] Deploy and monitor

---

## Common Issues & Solutions

### Issue: Categories not showing correct colors

**Solution**: Ensure category name matches exactly (case-insensitive):
```typescript
// ✅ Correct
category: 'groceries'
category: 'GROCERIES'

// ❌ Wrong
category: 'Groceries'
category: 'grocery'
```

### Issue: Progress bar not filling correctly

**Solution**: Check spent/limit calculation:
```typescript
// ✅ Correct - spent should be less than or equal to limit for normal budgets
spent: 2000,
limit: 5000,

// ❌ Wrong - percentage will be > 100%
spent: 6000,
limit: 5000,  // This is valid but shows over budget state
```

### Issue: Status not updating in real-time

**Solution**: Ensure Firestore listener is properly set up:
```typescript
const unsubscribe = onSnapshot(query, (snapshot) => {
  // Update state here
});

// Don't forget to cleanup
return () => unsubscribe();
```

---

## Support

For questions or issues, refer to:
- BUDGET_TRACKER_README.md (detailed documentation)
- BudgetTrackerDemo.tsx (working example)
- phase1_completion.md (project context)
