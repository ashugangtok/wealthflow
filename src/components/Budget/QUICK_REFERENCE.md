# BudgetTracker - Quick Reference Guide

## Component Import

```typescript
import BudgetTracker from '@/components/Budget/BudgetTracker';
import type { BudgetItem } from '@/components/Budget/BudgetTracker';
```

## Basic Data Structure

```typescript
const budget: BudgetItem = {
  id: '1',
  name: 'Monthly Groceries',
  category: 'groceries',  // Must be lowercase
  spent: 2500,            // Amount spent so far
  limit: 5000,            // Budget limit
  period: 'monthly',      // 'monthly' or 'yearly'
};
```

## Quick Implementation

### Full-Featured Budget Page

```typescript
import { useState, useEffect } from 'react';
import BudgetTracker from '@/components/Budget/BudgetTracker';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);

  useEffect(() => {
    // TODO: Replace with real Firebase fetch
    setBudgets([
      {
        id: '1',
        name: 'Groceries',
        category: 'groceries',
        spent: 2500,
        limit: 5000,
        period: 'monthly',
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-purple-950 p-8">
      <h1 className="text-4xl font-bold text-white mb-8">My Budgets</h1>
      <BudgetTracker
        budgets={budgets}
        onEditBudget={(id) => console.log('Edit:', id)}
        onDeleteBudget={(id) => setBudgets(budgets.filter(b => b.id !== id))}
        showActions={true}
        compact={false}
      />
    </div>
  );
}
```

### Dashboard Widget

```typescript
<div>
  <h2 className="text-2xl font-bold text-white mb-6">Top Budgets</h2>
  <BudgetTracker
    budgets={budgets.slice(0, 3)}
    compact={true}
    showActions={false}
  />
</div>
```

### Read-Only Display

```typescript
<BudgetTracker
  budgets={budgets}
  showActions={false}
/>
```

## Category Colors & Icons

| Category | Icon | Colors |
|----------|------|--------|
| **food** | 🍽️ | Orange → Red |
| **groceries** | 🛒 | Green → Emerald |
| **dining** | 🍽️ | Rose → Pink |
| **travel** | ✈️ | Blue → Cyan |
| **fuel** | ⛽ | Yellow → Orange |
| **utilities** | ⚡ | Violet → Purple |
| **housing** | 🏠 | Indigo → Blue |
| **shopping** | 🛒 | Fuchsia → Pink |
| **health** | ❤️ | Red → Rose |
| **education** | 📚 | Cyan → Blue |
| **entertainment** | 🎮 | Pink → Fuchsia |
| **music** | 🎵 | Purple → Pink |
| **phone** | 📱 | Teal → Cyan |
| **other** | 💰 | Gray → Slate |

## Status Indicators

```
On Track:    0-74%  → Green badge with checkmark
Warning:     75-99% → Amber badge with alert
Over Budget: >100%  → Red badge with trending up
```

## Props

```typescript
interface BudgetTrackerProps {
  budgets: BudgetItem[];                    // Required
  onEditBudget?: (budgetId: string) => void;    // Optional
  onDeleteBudget?: (budgetId: string) => void;  // Optional
  compact?: boolean;                        // Default: false
  showActions?: boolean;                    // Default: true
}
```

## Firebase Integration

### Fetch Budgets

```typescript
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/firebase/config';

useEffect(() => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, 'users', userId, 'budgets'),
      where('active', '==', true)
    ),
    (snapshot) => {
      const budgetList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as BudgetItem[];
      setBudgets(budgetList);
    }
  );
  return () => unsubscribe();
}, [userId]);
```

### Delete Budget

```typescript
const handleDeleteBudget = async (budgetId: string) => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'budgets', budgetId));
    setBudgets(budgets.filter(b => b.id !== budgetId));
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Zustand Store

```typescript
import { useFinanceStore } from '@/store/financeStore';

function MyComponent() {
  const { budgets, deleteBudget } = useFinanceStore();
  
  return (
    <BudgetTracker
      budgets={budgets}
      onDeleteBudget={deleteBudget}
    />
  );
}
```

## Styling Overrides

### Change Colors

```typescript
// In BudgetTracker.tsx, modify categoryColorMap:
const categoryColorMap: Record<string, any> = {
  groceries: {
    bg: 'bg-teal-500/10',           // Change background
    text: 'text-teal-400',          // Change text
    progress: 'bg-gradient-to-r from-teal-500 to-green-500',  // Change gradient
    icon: 'text-teal-400',          // Change icon
  },
};
```

### Custom Background

```typescript
<div className="p-8 bg-gradient-to-br from-blue-950 via-purple-950 to-slate-950">
  <BudgetTracker budgets={budgets} />
</div>
```

## Common Patterns

### Track Spending Against Multiple Budgets

```typescript
const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
const percentage = (totalSpent / totalLimit) * 100;
```

### Count Budgets by Status

```typescript
const onTrackCount = budgets.filter(b => (b.spent / b.limit) < 0.75).length;
const warningCount = budgets.filter(b => {
  const p = b.spent / b.limit;
  return p >= 0.75 && p <= 1;
}).length;
const overBudgetCount = budgets.filter(b => b.spent > b.limit).length;
```

### Sort Budgets by Status

```typescript
const sortedBudgets = [...budgets].sort((a, b) => {
  const aPercent = a.spent / a.limit;
  const bPercent = b.spent / b.limit;
  return bPercent - aPercent; // Highest usage first
});
```

### Filter Critical Budgets

```typescript
const criticalBudgets = budgets.filter(b => b.spent >= b.limit * 0.75);
```

## Example with All Features

```typescript
import { useState, useEffect } from 'react';
import BudgetTracker from '@/components/Budget/BudgetTracker';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetItem | null>(null);

  useEffect(() => {
    // Fetch from Firebase
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    const snapshot = await db
      .collection(`users/${userId}/budgets`)
      .get();
    
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as BudgetItem[];
    
    setBudgets(data);
  };

  const handleEdit = (budgetId: string) => {
    const budget = budgets.find(b => b.id === budgetId);
    setSelectedBudget(budget || null);
    setIsEditOpen(true);
  };

  const handleDelete = async (budgetId: string) => {
    await deleteDoc(doc(db, 'users', userId, 'budgets', budgetId));
    setBudgets(budgets.filter(b => b.id !== budgetId));
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <header className="mb-12">
        <h1 className="text-5xl font-bold text-white">Budgets</h1>
        <p className="text-white/60 mt-2">Track spending across categories</p>
      </header>

      <main>
        <BudgetTracker
          budgets={budgets}
          onEditBudget={handleEdit}
          onDeleteBudget={handleDelete}
          showActions={true}
          compact={false}
        />
      </main>
    </div>
  );
}
```

## Component Exports

```typescript
// Main component
export { BudgetTracker } from './BudgetTracker';
export type { BudgetTrackerProps } from './BudgetTracker';

// Demo
export { BudgetTrackerDemo } from './BudgetTrackerDemo';

// In your component registry/barrel export
export { BudgetTracker, BudgetTrackerDemo };
```

## TypeScript Definitions

```typescript
interface BudgetItem {
  id: string;
  name: string;
  category: string;
  spent: number;
  limit: number;
  period: 'monthly' | 'yearly';
  color?: string;
  lastUpdated?: Date;
}

interface BudgetTrackerProps {
  budgets: BudgetItem[];
  onEditBudget?: (budgetId: string) => void;
  onDeleteBudget?: (budgetId: string) => void;
  compact?: boolean;
  showActions?: boolean;
}

type StatusType = 'on_track' | 'warning' | 'over_budget';
```

## Testing Snippets

```typescript
// Jest/Vitest test
import { render, screen } from '@testing-library/react';
import BudgetTracker from './BudgetTracker';

describe('BudgetTracker', () => {
  const mockBudgets: BudgetItem[] = [
    {
      id: '1',
      name: 'Test Budget',
      category: 'groceries',
      spent: 2000,
      limit: 5000,
      period: 'monthly',
    },
  ];

  test('renders budgets', () => {
    render(<BudgetTracker budgets={mockBudgets} />);
    expect(screen.getByText('Test Budget')).toBeInTheDocument();
  });

  test('calculates percentage correctly', () => {
    render(<BudgetTracker budgets={mockBudgets} />);
    // 2000/5000 = 40%
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  test('shows on track status', () => {
    render(<BudgetTracker budgets={mockBudgets} />);
    expect(screen.getByText('On Track')).toBeInTheDocument();
  });
});
```

## File Locations

```
D:\Finance\src\components\Budget\
├── BudgetTracker.tsx           ← Main component
├── BudgetTrackerDemo.tsx       ← Demo with sample data
├── BudgetModule.tsx            ← Original (optional)
├── BUDGET_TRACKER_README.md    ← Full documentation
├── INTEGRATION_GUIDE.md        ← Integration steps
└── QUICK_REFERENCE.md          ← This file
```

## Next Steps

1. **Copy** BudgetTracker.tsx to your project
2. **Import** the component in your page
3. **Add** sample data or fetch from Firebase
4. **Connect** handlers to your edit/delete logic
5. **Style** the parent container as needed
6. **Test** with real data

## Troubleshooting

**Q: Colors not showing?**
A: Ensure Tailwind CSS is properly configured with color values.

**Q: Progress bar not filling?**
A: Check that `spent <= limit` for on-budget items.

**Q: Icons missing?**
A: Verify lucide-react is installed: `npm install lucide-react`

**Q: Real-time updates not working?**
A: Check Firestore listener is properly set up and returning data.

## Quick Deploy Checklist

- [ ] Component copied to project
- [ ] Imports working
- [ ] TypeScript types resolved
- [ ] Sample data displays correctly
- [ ] Edit handler implemented
- [ ] Delete handler implemented
- [ ] Firebase connected (if needed)
- [ ] Styles match theme
- [ ] Responsive layout tested
- [ ] Deployed to staging

---

**Last Updated**: June 26, 2026
**Status**: Production Ready v1.0.0
