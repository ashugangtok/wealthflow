import React, { useState } from 'react';
import BudgetTracker from './BudgetTracker';

interface BudgetItem {
  id: string;
  name: string;
  category: string;
  spent: number;
  limit: number;
  period: 'monthly' | 'yearly';
}

/**
 * Demo component showing BudgetTracker usage with sample data
 *
 * Features demonstrated:
 * - Multiple categories with color-coded progress bars
 * - Status indicators (On Track, Warning, Over Budget)
 * - Category icons
 * - Spending metrics and remaining amounts
 * - Responsive grid layout
 */
export const BudgetTrackerDemo: React.FC = () => {
  // Sample budget data with different spending levels
  const [budgets, setBudgets] = useState<BudgetItem[]>([
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
      name: 'Dining Out',
      category: 'dining',
      spent: 5800,
      limit: 5000, // Over budget
      period: 'monthly',
    },
    {
      id: '3',
      name: 'Travel',
      category: 'travel',
      spent: 8500,
      limit: 10000,
      period: 'monthly',
    },
    {
      id: '4',
      name: 'Utilities',
      category: 'utilities',
      spent: 2100,
      limit: 3000,
      period: 'monthly',
    },
    {
      id: '5',
      name: 'Health & Fitness',
      category: 'health',
      spent: 3900,
      limit: 4000,
      period: 'monthly',
    },
    {
      id: '6',
      name: 'Entertainment',
      category: 'entertainment',
      spent: 1500,
      limit: 2000,
      period: 'monthly',
    },
    {
      id: '7',
      name: 'Fuel',
      category: 'fuel',
      spent: 2200,
      limit: 2500,
      period: 'monthly',
    },
    {
      id: '8',
      name: 'Shopping',
      category: 'shopping',
      spent: 7200,
      limit: 8000,
      period: 'monthly',
    },
  ]);

  const handleEditBudget = (budgetId: string) => {
    console.log('Edit budget:', budgetId);
    // Implement edit logic
  };

  const handleDeleteBudget = (budgetId: string) => {
    setBudgets(budgets.filter((b) => b.id !== budgetId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Budget Tracker
          </h1>
          <p className="text-white/60 text-lg">
            Monitor your spending across categories with real-time status indicators
          </p>
        </div>

        {/* Budget Tracker Component */}
        <BudgetTracker
          budgets={budgets}
          onEditBudget={handleEditBudget}
          onDeleteBudget={handleDeleteBudget}
          compact={false}
          showActions={true}
        />

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <h3 className="text-emerald-300 font-semibold mb-2">On Track</h3>
            <p className="text-emerald-200 text-sm">
              Spending is at 0-74% of your budget limit
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <h3 className="text-amber-300 font-semibold mb-2">Warning</h3>
            <p className="text-amber-200 text-sm">
              Spending is at 75-99% of your budget limit
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
            <h3 className="text-red-300 font-semibold mb-2">Over Budget</h3>
            <p className="text-red-200 text-sm">
              Spending exceeds your budget limit
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 p-8 rounded-3xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Features</h2>
          <ul className="space-y-3 text-white/80">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              Colorful category-specific progress bars with gradients
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              Real-time status indicators (On Track, Warning, Over Budget)
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              Category-specific icons (Food, Travel, Utilities, etc.)
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-400" />
              Comprehensive spending metrics (Spent, Limit, Remaining)
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-pink-400" />
              Responsive grid layout (mobile, tablet, desktop)
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              Summary statistics showing overall budget health
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              Edit and delete actions with hover effects
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-fuchsia-400" />
              Compact mode for dashboard integration
            </li>
          </ul>
        </div>

        {/* Usage Examples */}
        <div className="mt-12 p-8 rounded-3xl bg-slate-900/50 border border-white/5">
          <h2 className="text-2xl font-bold text-white mb-6">Usage Examples</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Full Budget Tracker (Current View)
              </h3>
              <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-xs text-white/80">
{`<BudgetTracker
  budgets={budgets}
  onEditBudget={handleEditBudget}
  onDeleteBudget={handleDeleteBudget}
  compact={false}
  showActions={true}
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Compact Mode for Dashboard
              </h3>
              <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-xs text-white/80">
{`<BudgetTracker
  budgets={topBudgets}
  compact={true}
  showActions={false}
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Sample Budget Item Structure
              </h3>
              <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-xs text-white/80">
{`interface BudgetItem {
  id: string;              // Unique identifier
  name: string;            // Budget display name
  category: string;        // Category (food, travel, utilities, etc.)
  spent: number;           // Amount spent so far
  limit: number;           // Budget limit
  period: 'monthly' | 'yearly';
  color?: string;          // Optional custom color
  lastUpdated?: Date;      // Last update timestamp
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Supported Categories
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  'food', 'groceries', 'dining', 'travel',
                  'fuel', 'utilities', 'housing', 'shopping',
                  'health', 'education', 'entertainment', 'music',
                  'phone', 'other'
                ].map((cat) => (
                  <div key={cat} className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-sm text-white/80">
                    {cat}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTrackerDemo;
