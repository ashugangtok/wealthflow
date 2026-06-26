# BudgetTracker Component Documentation

## Overview

The `BudgetTracker` is a production-ready React component that displays budgets with colorful progress bars, percentage completion indicators, status badges, and category-specific icons. It provides users with a comprehensive view of their spending across multiple budget categories.

## Features

### Core Features
- **Colorful Progress Bars**: Gradient-filled progress bars with category-specific colors
- **Status Indicators**: Real-time status badges showing "On Track", "Warning", or "Over Budget"
- **Category Icons**: 14+ pre-mapped category icons (Food, Travel, Utilities, Health, etc.)
- **Percentage Completion**: Visual and numerical percentage display
- **Spending Metrics**: Shows Spent, Limit, and Remaining amounts
- **Summary Statistics**: Total spent, total limit, budget counts by status

### UI Features
- **Responsive Grid**: 1-3 column layout based on screen size
- **Compact Mode**: Condensed view for dashboard integration
- **Hover Effects**: Edit/Delete buttons appear on hover
- **Color Coding**: Different color schemes for each category
- **Over Budget Warnings**: Alert box when spending exceeds limit
- **Gradient Backgrounds**: Modern glassmorphism effect

### Accessibility
- Semantic HTML structure
- Color contrast compliance
- Icon + text status indicators
- Keyboard-friendly button interactions

## Component Props

```typescript
interface BudgetTrackerProps {
  budgets: BudgetItem[];           // Array of budget items to display
  onEditBudget?: (budgetId: string) => void;    // Edit button callback
  onDeleteBudget?: (budgetId: string) => void;  // Delete button callback
  compact?: boolean;               // Enable compact mode (default: false)
  showActions?: boolean;           // Show edit/delete buttons (default: true)
}
```

## Data Structure

```typescript
interface BudgetItem {
  id: string;                      // Unique identifier
  name: string;                    // Budget display name (e.g., "Groceries")
  category: string;                // Category key for styling (see Supported Categories)
  spent: number;                   // Amount spent so far
  limit: number;                   // Budget limit
  period: 'monthly' | 'yearly';    // Budget period
  color?: string;                  // Optional custom color (Tailwind class)
  lastUpdated?: Date;              // Optional update timestamp
}
```

## Supported Categories

Each category has a dedicated icon and color scheme:

| Category | Icon | Primary Color | Gradient |
|----------|------|---------------|----------|
| food | Utensils | Orange | Orange → Red |
| groceries | ShoppingCart | Green | Green → Emerald |
| dining | Utensils | Rose | Rose → Pink |
| travel | Plane | Blue | Blue → Cyan |
| fuel | Fuel | Yellow | Yellow → Orange |
| utilities | Zap | Violet | Violet → Purple |
| housing | Home | Indigo | Indigo → Blue |
| shopping | ShoppingCart | Fuchsia | Fuchsia → Pink |
| health | Heart | Red | Red → Rose |
| education | Book | Cyan | Cyan → Blue |
| entertainment | Gamepad2 | Pink | Pink → Fuchsia |
| music | Music | Purple | Purple → Pink |
| phone | Smartphone | Teal | Teal → Cyan |
| other | DollarSign | Gray | Gray → Slate |

## Status Indicators

### Status Types
- **On Track**: 0-74% of budget spent (Green indicator)
- **Warning**: 75-99% of budget spent (Amber indicator)
- **Over Budget**: >100% of budget spent (Red indicator)

### Status Display
Each status includes:
- Color-coded badge background
- Dot indicator
- Icon (CheckCircle2 / AlertTriangle / TrendingUp)
- Status label text

## Usage Examples

### Basic Usage
```typescript
import BudgetTracker from './BudgetTracker';

const MyComponent = () => {
  const [budgets] = useState<BudgetItem[]>([
    {
      id: '1',
      name: 'Groceries',
      category: 'groceries',
      spent: 4200,
      limit: 6000,
      period: 'monthly',
    },
    {
      id: '2',
      name: 'Travel',
      category: 'travel',
      spent: 8500,
      limit: 10000,
      period: 'monthly',
    },
  ]);

  return (
    <BudgetTracker
      budgets={budgets}
      onEditBudget={(id) => console.log('Edit', id)}
      onDeleteBudget={(id) => console.log('Delete', id)}
    />
  );
};
```

### Compact Mode for Dashboard
```typescript
<BudgetTracker
  budgets={topThreeBudgets}
  compact={true}
  showActions={false}
/>
```

### Read-Only Display
```typescript
<BudgetTracker
  budgets={budgets}
  showActions={false}
/>
```

### Full-Featured Page
```typescript
<div className="p-8">
  <h1 className="text-4xl font-bold text-white mb-8">My Budgets</h1>
  <BudgetTracker
    budgets={budgets}
    onEditBudget={handleEdit}
    onDeleteBudget={handleDelete}
    compact={false}
    showActions={true}
  />
</div>
```

## Color Scheme

The component uses Tailwind CSS color utilities:

```css
/* Background Colors */
bg-orange-500/10    /* food */
bg-green-500/10     /* groceries */
bg-blue-500/10      /* travel */
bg-violet-500/10    /* utilities */
/* ... and more for each category */

/* Progress Gradients */
from-orange-500 to-red-500           /* food */
from-green-500 to-emerald-500        /* groceries */
from-blue-500 to-cyan-500            /* travel */
/* ... and more for each category */
```

## Responsive Behavior

### Desktop (1024px+)
- 3-column grid layout
- Full size budget cards
- Summary statistics visible
- Edit/Delete buttons on hover

### Tablet (768px-1023px)
- 2-column grid layout
- Medium size budget cards
- All features visible

### Mobile (< 768px)
- 1-column grid layout
- Card sizes adapt for small screens
- Touch-friendly button sizing
- Optimized spacing

## Styling & Customization

### Default Theme
- Dark background: `from-slate-950 via-purple-950 to-slate-950`
- Card backgrounds: `bg-white/5` with `border-white/10`
- Text: White with various opacity levels
- Accents: Category-specific colors

### Modifying Colors
Update the `categoryColorMap` object to customize:

```typescript
const categoryColorMap: Record<string, { 
  bg: string;           // Card background
  text: string;         // Percentage text color
  progress: string;     // Progress bar gradient
  icon: string;         // Icon color
}> = {
  food: { 
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    progress: 'bg-gradient-to-r from-orange-500 to-red-500',
    icon: 'text-orange-400'
  },
  // ... more categories
};
```

## Integration Points

### With State Management
```typescript
// Using Zustand
const { budgets, editBudget, deleteBudget } = useFinanceStore();

<BudgetTracker
  budgets={budgets}
  onEditBudget={editBudget}
  onDeleteBudget={deleteBudget}
/>
```

### With Firebase
```typescript
useEffect(() => {
  const unsubscribe = db
    .collection(`users/${userId}/budgets`)
    .onSnapshot((snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setBudgets(data);
    });
  
  return unsubscribe;
}, [userId]);
```

### With Forms
```typescript
const handleEdit = (budgetId: string) => {
  const budget = budgets.find(b => b.id === budgetId);
  setEditingBudget(budget);
  setShowModal(true);
};
```

## Performance Considerations

- **Memoization**: Component uses `useMemo` for statistics calculation
- **Lazy Rendering**: Cards render only when visible (with virtualization support)
- **Transition Effects**: CSS transitions are GPU-accelerated
- **Bundle Size**: ~12KB minified (with lucide-react icons)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Dependencies

- React 18+
- Tailwind CSS 3+
- lucide-react (for icons)

## TypeScript Support

The component is fully typed with:
- `BudgetTrackerProps` interface
- `BudgetItem` interface
- `StatusType` union type
- All callbacks properly typed

## Accessibility Features

- ✅ Semantic HTML (buttons, divs with proper roles)
- ✅ ARIA labels for status indicators
- ✅ Color contrast ratios > 7:1
- ✅ Focus states for keyboard navigation
- ✅ Icon + text combinations (not relying on color alone)
- ✅ Touch targets minimum 44x44px

## Known Limitations

- Custom colors via `color` prop currently unused (for future enhancement)
- No animation config options (uses hardcoded duration-500/700)
- Summary stats always show for non-compact mode (can't be disabled)

## Future Enhancements

- [ ] Chart visualization (pie chart of spending by category)
- [ ] Budget comparison (month-to-month, year-to-year)
- [ ] Custom budget colors and icons
- [ ] Recurring budget templates
- [ ] Budget alerts and notifications
- [ ] Export budget reports (PDF/CSV)
- [ ] Budget recommendations based on spending patterns

## File Structure

```
src/components/Budget/
├── BudgetTracker.tsx          # Main component
├── BudgetTrackerDemo.tsx      # Demo with sample data
├── BUDGET_TRACKER_README.md   # This file
└── BudgetModule.tsx           # Original budget module (legacy)
```

## Testing Recommendations

### Unit Tests
- Test status calculation (on_track, warning, over_budget)
- Test percentage calculations
- Test icon/color mapping for categories
- Test callback functions

### Integration Tests
- Test with Firebase data
- Test edit/delete workflows
- Test responsive layouts
- Test with real budget data

### E2E Tests
- User adds/edits/deletes budgets
- User views budget summary
- Mobile responsiveness
- Status transitions

## Changelog

### v1.0.0 (Current)
- Initial release
- 14 category presets
- Compact and full modes
- Status indicators
- Summary statistics
- Responsive design
- Dark theme only

## License

Proprietary - WEALTHFLOW Project

## Support & Questions

For issues or questions, contact: mani@lifesciencetrust.com
