# WEALTHFLOW - Quick Start Guide

## 🚀 Project Setup

### 1. Install Dependencies

```bash
cd D:\Finance
npm install

# Add missing dependencies for WEALTHFLOW
npm install framer-motion react-query zod date-fns zustand
npm install --save-dev tailwindcss-animate
```

### 2. Update package.json

Add to your scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx",
    "type-check": "tsc --noEmit"
  }
}
```

### 3. Environment Setup

Create `.env.local`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Feature flags
VITE_ENABLE_AI_ADVISOR=true
VITE_ENABLE_HOUSE_PLANNER=true
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

---

## 📁 Project Structure Overview

```
src/
├── components/          # React components
│   ├── auth/           # Login/Signup
│   ├── dashboard/      # Main dashboard
│   ├── income/         # Income module
│   ├── expenses/       # Expense module
│   ├── credit-cards/   # Credit cards
│   ├── bank-accounts/  # Bank accounts
│   ├── investments/    # Investments
│   ├── assets/         # Assets
│   ├── liabilities/    # Liabilities
│   ├── goals/          # Goals
│   ├── house-planner/  # House planner
│   ├── subscriptions/  # Subscriptions
│   ├── ai-advisor/     # AI insights
│   ├── reports/        # Reports
│   ├── settings/       # Settings
│   ├── shared/         # Navigation, Layout
│   └── ui/             # Reusable UI components
├── services/           # Firebase services
├── hooks/              # Custom React hooks
├── types/              # TypeScript types
├── utils/              # Utility functions
├── context/            # React Context
├── styles/             # Global styles
└── App.tsx            # Main app component
```

---

## 🎨 WEALTHFLOW Color Palette

### Primary Colors
- **Background**: `#09090B` (Dark)
- **Card**: `#111827` (Darker)
- **Primary**: `#7C3AED` (Violet)
- **Secondary**: `#06B6D4` (Cyan)

### Status Colors
- **Success**: `#10B981` (Green)
- **Warning**: `#F59E0B` (Amber)
- **Danger**: `#EF4444` (Red)

### Usage in Tailwind
```jsx
// Background
className="bg-background"        // #09090B
className="bg-card"              // #111827

// Primary
className="bg-primary"           // #7C3AED
className="text-primary"

// With opacity
className="bg-primary/20"        // 20% opacity
className="border-primary/50"
```

---

## 🧩 Reusable Components Available

### Card Components
```jsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';

<Card>
  <CardHeader title="Income" subtitle="This month" />
  <CardBody>Your content here</CardBody>
  <CardFooter>Footer content</CardFooter>
</Card>
```

### Button
```jsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="md" loading={false}>
  Click me
</Button>

// Variants: primary, secondary, ghost, danger, success
// Sizes: sm, md, lg
```

### Input
```jsx
import { Input, TextArea } from '@/components/ui/Input';

<Input
  label="Amount"
  type="number"
  placeholder="0.00"
  error={errors.amount}
  helperText="Enter transaction amount"
/>

<TextArea
  label="Description"
  placeholder="Enter notes..."
  rows={3}
/>
```

### Badge
```jsx
import { Badge } from '@/components/ui/Badge';

<Badge variant="success" size="md">
  Active
</Badge>

// Variants: default, primary, success, warning, danger, info
```

### Modal
```jsx
import { Modal } from '@/components/ui/Modal';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Add Income"
  size="md"
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSubmit}>
        Add
      </Button>
    </>
  }
>
  {/* Modal content */}
</Modal>
```

---

## 📊 Charts & Visualizations

Using Recharts with dark theme styling:

```jsx
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={data}>
    <defs>
      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
    <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
    <YAxis stroke="rgba(255,255,255,0.5)" />
    <Tooltip
      contentStyle={{
        background: '#111827',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px'
      }}
    />
    <Area
      type="monotone"
      dataKey="value"
      stroke="#10B981"
      fill="url(#colorIncome)"
      strokeWidth={2}
    />
  </AreaChart>
</ResponsiveContainer>
```

---

## 🔥 Animations

### Tailwind Animations
```jsx
// Fade in
className="animate-fade-in"

// Slide up
className="animate-slide-up"

// Scale in
className="animate-scale-in"

// Pulse
className="animate-pulse-soft"

// Float
className="animate-float"
```

### Custom CSS Animations
Check `src/styles/animations.css` for more animation options.

---

## 🔐 Authentication Flow

### Login with Email/Password
```jsx
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/services/firebase';

const handleLogin = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log('Logged in:', result.user);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Login with Google
```jsx
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/services/firebase';

const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log('Logged in with Google:', result.user);
  } catch (error) {
    console.error('Google login failed:', error);
  }
};
```

---

## 📱 Responsive Design Pattern

```jsx
// Use Tailwind responsive utilities
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* 1 column on mobile, 2 on tablet, 4 on desktop */}
</div>

// Breakpoints
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## 🚀 Building Your First Module: Income

### Step 1: Create the component
```tsx
// src/components/income/IncomeModule.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Plus } from 'lucide-react';
import { Income } from '@/types';

export const IncomeModule: React.FC = () => {
  const [incomeList, setIncomeList] = useState<Income[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const handleAddIncome = async () => {
    // TODO: Call Firebase to add income
    console.log('Adding income:', formData);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Income</h1>
        <Button
          variant="primary"
          icon={<Plus size={20} />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Income
        </Button>
      </div>

      {/* Income Table */}
      <Card>
        <CardHeader title="This Month Income" />
        <CardBody>
          {/* TODO: Render income list */}
        </CardBody>
      </Card>

      {/* Add Income Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Income"
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddIncome}
            >
              Add
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Source"
            placeholder="e.g., Salary, Freelance..."
            value={formData.source}
            onChange={(e) =>
              setFormData({ ...formData, source: e.target.value })
            }
          />
          <Input
            label="Amount"
            type="number"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
          />
          <Input
            label="Description"
            placeholder="Add notes..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
      </Modal>
    </div>
  );
};

export default IncomeModule;
```

### Step 2: Add to routing
```tsx
// Update your App.tsx router
import { IncomeModule } from '@/components/income/IncomeModule';

// Add route
<Route path="/income" element={<IncomeModule />} />
```

---

## 💾 Firebase Tips

### Read Data
```tsx
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '@/services/firebase';

const fetchIncome = async (userId: string) => {
  const q = query(
    collection(db, 'income'),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
```

### Write Data
```tsx
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/services/firebase';

const addIncome = async (userId: string, data: Income) => {
  const docRef = await addDoc(collection(db, 'income'), {
    ...data,
    userId,
    createdAt: new Date(),
  });
  return docRef.id;
};
```

### Delete Data
```tsx
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/services/firebase';

const deleteIncome = async (incomeId: string) => {
  await deleteDoc(doc(db, 'income', incomeId));
};
```

---

## 🎯 Next Actions

1. ✅ Create UI components (done)
2. ✅ Create Dashboard (done)
3. ⬜ Create Income Module
4. ⬜ Create Expense Module
5. ⬜ Create Credit Card Module
6. ⬜ Build remaining modules
7. ⬜ Deploy to Firebase Hosting

---

## 📚 Useful Resources

- [Tailwind CSS Docs](https://tailwindcss.com)
- [Recharts Docs](https://recharts.org)
- [Firebase Docs](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## ✨ WEALTHFLOW is Ready!

Your premium fintech dashboard foundation is set up. Now build the amazing features! 🚀

Good luck building WEALTHFLOW! 💚
