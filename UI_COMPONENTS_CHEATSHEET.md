# WEALTHFLOW - UI Components Cheat Sheet

Quick reference for all available UI components and how to use them.

## 🎨 Color System

### Primary Colors
```jsx
// Using Tailwind class names
className="bg-primary"          // #7C3AED (Violet)
className="bg-secondary"        // #06B6D4 (Cyan)
className="bg-success"          // #10B981 (Green)
className="bg-warning"          // #F59E0B (Amber)
className="bg-danger"           // #EF4444 (Red)

// With opacity
className="bg-primary/10"       // 10% opacity
className="bg-primary/20"       // 20% opacity
className="bg-primary/50"       // 50% opacity

// Text colors
className="text-primary"
className="text-white/60"       // With opacity
```

---

## 📦 Card Component

### Basic Card
```jsx
import { Card } from '@/components/ui/Card';

<Card>
  <div>Your content here</div>
</Card>
```

### With Header, Body, Footer
```jsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';

<Card>
  <CardHeader 
    title="Income Statement"
    subtitle="This month"
    action={<Button>View All</Button>}
  />
  <CardBody>
    <p>Card content goes here</p>
  </CardBody>
  <CardFooter>
    <p>Footer content</p>
  </CardFooter>
</Card>
```

### With Styling
```jsx
<Card className="border-primary/50 hover:shadow-glow">
  Content
</Card>
```

---

## 🔘 Button Component

### Variants
```jsx
import { Button } from '@/components/ui/Button';

// Primary (Default)
<Button variant="primary">Save</Button>

// Secondary
<Button variant="secondary">Cancel</Button>

// Ghost (Transparent)
<Button variant="ghost">Learn More</Button>

// Danger
<Button variant="danger">Delete</Button>

// Success
<Button variant="success">Confirm</Button>
```

### Sizes
```jsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### With Icons
```jsx
import { Plus, Trash2, Edit } from 'lucide-react';

<Button icon={<Plus size={20} />}>Add Income</Button>
<Button icon={<Trash2 size={20} />} variant="danger">Delete</Button>
<Button icon={<Edit size={20} />} iconPosition="right">Edit</Button>
```

### Loading State
```jsx
<Button loading={isLoading}>Save</Button>
```

### Full Width
```jsx
<Button fullWidth>Full Width Button</Button>
```

---

## 📝 Input Component

### Basic Input
```jsx
import { Input } from '@/components/ui/Input';

<Input
  type="text"
  placeholder="Enter your name"
/>
```

### With Label & Validation
```jsx
<Input
  label="Amount"
  type="number"
  placeholder="0.00"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  error={errors.amount}
  helperText="Enter transaction amount"
/>
```

### With Icon
```jsx
import { DollarSign } from 'lucide-react';

<Input
  label="Amount"
  icon={<DollarSign size={18} />}
  type="number"
/>
```

### Input Types
```jsx
<Input type="text" />
<Input type="email" />
<Input type="password" />
<Input type="number" />
<Input type="date" />
<Input type="tel" />
```

### TextArea
```jsx
import { TextArea } from '@/components/ui/Input';

<TextArea
  label="Description"
  placeholder="Enter notes..."
  rows={4}
  helperText="Max 500 characters"
/>
```

---

## 🏷️ Badge Component

### Variants
```jsx
import { Badge } from '@/components/ui/Badge';

<Badge variant="default">Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>
```

### Sizes
```jsx
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

### With Icon
```jsx
import { CheckCircle } from 'lucide-react';

<Badge 
  variant="success" 
  icon={<CheckCircle size={14} />}
>
  Completed
</Badge>
```

---

## 🪟 Modal Component

### Basic Modal
```jsx
import { Modal } from '@/components/ui/Modal';

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Add Income"
>
  {/* Modal content */}
</Modal>
```

### With Footer
```jsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
  footer={
    <>
      <Button 
        variant="secondary" 
        onClick={() => setIsOpen(false)}
      >
        Cancel
      </Button>
      <Button variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </>
  }
>
  <p>Are you sure you want to delete this item?</p>
</Modal>
```

### Sizes
```jsx
<Modal size="sm">Small</Modal>  {/* max-w-sm */}
<Modal size="md">Medium</Modal> {/* max-w-md */}
<Modal size="lg">Large</Modal>  {/* max-w-lg */}
<Modal size="xl">Extra Large</Modal> {/* max-w-xl */}
```

---

## 🎬 Animations

### Tailwind Animations
```jsx
// Fade in
className="animate-fade-in"

// Fade out
className="animate-fade-out"

// Slide up
className="animate-slide-up"

// Slide down
className="animate-slide-down"

// Slide left
className="animate-slide-left"

// Slide right
className="animate-slide-right"

// Scale in
className="animate-scale-in"

// Pulse (soft)
className="animate-pulse-soft"

// Float
className="animate-float"

// Shimmer (loading)
className="animate-shimmer"
```

### Applying Animations
```jsx
<div className="animate-fade-in">Content fades in</div>
<div className="animate-slide-up">Content slides up</div>
<Button className="hover:scale-105 transition-transform">
  Hover to scale
</Button>
```

---

## 📊 Tailwind Utility Classes

### Display & Layout
```jsx
className="flex"              // Flexbox
className="grid"              // CSS Grid
className="block"             // Block display
className="hidden"            // Display none
className="items-center"      // Vertical center
className="justify-between"   // Space between
className="gap-4"             // Gap between items
```

### Spacing
```jsx
className="p-4"               // Padding: 1rem
className="px-6"              // Padding X: 1.5rem
className="py-4"              // Padding Y: 1rem
className="m-4"               // Margin: 1rem
className="mb-8"              // Margin bottom: 2rem
className="mt-0"              // Margin top: 0
className="space-y-4"         // Vertical space between children
className="space-x-2"         // Horizontal space between children
```

### Sizing
```jsx
className="w-full"            // Width: 100%
className="w-1/2"             // Width: 50%
className="h-32"              // Height: 8rem
className="min-h-screen"      // Min height: 100vh
className="max-w-lg"          // Max width: 32rem
```

### Text
```jsx
className="text-white"        // Text color
className="text-sm"           // Font size: 0.875rem
className="text-base"         // Font size: 1rem
className="text-lg"           // Font size: 1.125rem
className="text-xl"           // Font size: 1.25rem
className="text-2xl"          // Font size: 1.5rem
className="text-3xl"          // Font size: 1.875rem
className="font-bold"         // Font weight: 700
className="font-semibold"     // Font weight: 600
className="font-medium"       // Font weight: 500
className="text-center"       // Text alignment
className="text-white/60"     // Text with opacity
```

### Background & Borders
```jsx
className="bg-card"           // Background color
className="bg-primary/20"     // Background with opacity
className="border"            // Border: 1px solid
className="border-primary"    // Border color
className="border-t"          // Border top only
className="border-white/10"   // Border with opacity
className="rounded-lg"        // Border radius: 0.5rem
className="rounded-4xl"       // Border radius: 20px
```

### Hover & Transitions
```jsx
className="hover:bg-white/10"      // Hover background
className="hover:scale-105"        // Hover scale
className="hover:shadow-lg"        // Hover shadow
className="transition-all"         // Smooth transition
className="duration-300"           // Transition duration
```

### Shadows & Effects
```jsx
className="shadow-sm"         // Small shadow
className="shadow-lg"         // Large shadow
className="shadow-xl"         // Extra large shadow
className="shadow-glow"       // Glow effect (custom)
className="shadow-inner"      // Inner shadow
```

### Opacity
```jsx
className="opacity-50"        // 50% opacity
className="opacity-80"        // 80% opacity
className="bg-white/10"       // 10% opacity background
className="text-white/60"     // 60% opacity text
```

---

## 🎨 Glassmorphism Effects

### Glass Effect (Light)
```jsx
className="glass"
// Background: rgba(255, 255, 255, 0.1)
// Backdrop filter: blur(10px)
// Border: 1px solid rgba(255, 255, 255, 0.2)
```

### Glass Effect (Dark)
```jsx
className="glass-dark"
// Background: rgba(17, 24, 39, 0.8)
// Backdrop filter: blur(10px)
// Border: 1px solid rgba(255, 255, 255, 0.1)
```

### Applied in Components
```jsx
<div className="glass rounded-4xl p-6">
  Glassmorphic content
</div>

<div className="glass-dark backdrop-blur-lg">
  Dark glass effect
</div>
```

---

## 🔄 Common Patterns

### KPI Card Pattern
```jsx
<Card>
  <CardHeader title="Net Worth" subtitle="Updated today" />
  <CardBody>
    <div className="text-3xl font-bold text-white">₹50,00,000</div>
    <div className="text-success text-sm mt-2">↑ 12.5% from last month</div>
  </CardBody>
</Card>
```

### Form Pattern
```jsx
const [formData, setFormData] = useState({
  amount: '',
  category: '',
  date: '',
});
const [errors, setErrors] = useState({});

<div className="space-y-4">
  <Input
    label="Amount"
    type="number"
    value={formData.amount}
    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
    error={errors.amount}
  />
  <Input
    label="Date"
    type="date"
    value={formData.date}
    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
  />
  <Button variant="primary" onClick={handleSubmit}>
    Submit
  </Button>
</div>
```

### List Pattern
```jsx
<Card>
  <CardHeader title="Recent Transactions" />
  <CardBody>
    {transactions.map((transaction) => (
      <div key={transaction.id} className="flex justify-between py-3 border-b border-white/10">
        <div>
          <p className="text-white font-medium">{transaction.description}</p>
          <p className="text-white/60 text-sm">{transaction.date}</p>
        </div>
        <p className={transaction.type === 'income' ? 'text-success' : 'text-danger'}>
          {transaction.type === 'income' ? '+' : '-'} ₹{transaction.amount}
        </p>
      </div>
    ))}
  </CardBody>
</Card>
```

### Stats Grid Pattern
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <Card>
    <div className="text-white/60 text-sm mb-2">Total Income</div>
    <div className="text-2xl font-bold text-white">₹2,50,000</div>
  </Card>
  {/* Repeat for other stats */}
</div>
```

---

## 📱 Responsive Pattern

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* 1 column on mobile, 2 on tablet, 4 on desktop */}
</div>

<div className="hidden md:block">
  {/* Hidden on mobile, visible on tablet+ */}
</div>

<div className="text-sm md:text-base lg:text-lg">
  {/* Text size changes based on screen */}
</div>
```

---

## 🚀 Usage Tips

1. **Always use TypeScript** - Catch errors early
2. **Compose Components** - Combine small components into larger ones
3. **Use Tailwind Utilities** - Build complex layouts easily
4. **Keep Animations Smooth** - Use `transition-all duration-300`
5. **Test Responsive** - Check mobile, tablet, desktop
6. **Dark Mode First** - Design for dark theme
7. **Accessibility** - Add labels, error messages, help text
8. **Reuse Components** - Don't duplicate code

---

## 🎯 Component Quick Links

| Component | Path | Variants |
|-----------|------|----------|
| Card | `@/components/ui/Card` | Default |
| Button | `@/components/ui/Button` | 5 variants, 3 sizes |
| Input | `@/components/ui/Input` | Text, Number, Date, Email |
| Badge | `@/components/ui/Badge` | 6 variants, 3 sizes |
| Modal | `@/components/ui/Modal` | 4 sizes |

---

## 💡 Pro Tips

- Use `hover:` classes for interactive states
- Combine animations for micro-interactions
- Use opacity for disabled/inactive states
- Group related inputs in `space-y-4`
- Use cards for content grouping
- Always provide error messages
- Use badges for status indicators
- Leverage glass effects for layering

---

**You're ready to build amazing components!** 🎨

Check out the Dashboard component in `src/components/Dashboard/Dashboard.tsx` for real-world usage examples.
