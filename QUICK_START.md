# Quick Start Guide - Personal Finance Tracker

## 5-Minute Setup

### 1. Install Dependencies
```bash
cd Finance
npm install
```

### 2. Get Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project
3. Create Web app
4. Copy credentials

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env and paste Firebase credentials
```

### 4. Run Locally
```bash
npm start
```

Visit: `http://localhost:3000`

---

## Development Workflow

### Adding a New Feature

1. **Create Component**:
```javascript
// src/components/NewFeature/NewFeature.jsx
import React from 'react';
import { Box, Card, Typography } from '@mui/material';

const NewFeature = () => {
  return (
    <Box>
      <Typography variant="h4">New Feature</Typography>
      {/* Your content here */}
    </Box>
  );
};

export default NewFeature;
```

2. **Add Route** (in `src/App.jsx`):
```javascript
import NewFeature from './components/NewFeature/NewFeature';

// Add to routes:
<Route path="/new-feature" element={<NewFeature />} />
```

3. **Add Navigation** (in `src/components/Layout/Layout.jsx`):
```javascript
{ label: 'New Feature', icon: <Icon />, path: '/new-feature' }
```

### Adding Firestore Operations

```javascript
// In src/utils/firebaseHelpers.js
export const addNewItem = async (userId, itemData) => {
  return addDoc(collection(db, 'users', userId, 'newItems'), {
    ...itemData,
    createdAt: new Date(),
  });
};

export const getNewItems = async (userId) => {
  const snapshot = await getDocs(collection(db, 'users', userId, 'newItems'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
```

### Using Authentication

```javascript
import { useAuth } from '../../context/AuthContext';

const MyComponent = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return <div>Hello {user.email}</div>;
};
```

### Using Theme

```javascript
import { useTheme } from '../../context/ThemeContext';

const MyComponent = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};
```

---

## Firebase Setup Checklist

- [ ] Create Firebase project
- [ ] Create Web app in Firebase
- [ ] Copy credentials to `.env`
- [ ] Enable Email/Password auth
- [ ] Enable Google auth
- [ ] Add authorized domains
- [ ] Create Firestore database
- [ ] Update Firestore rules
- [ ] Create indexes (if needed)

---

## Deployment Checklist

- [ ] Update `.env` for production
- [ ] Run `npm run build`
- [ ] Test build locally: `npx serve build`
- [ ] Install Firebase CLI: `npm install -g firebase-tools`
- [ ] Login: `firebase login`
- [ ] Deploy: `firebase deploy`

---

## Common Tasks

### Change App Colors
Edit `src/config/theme.js`:
```javascript
primary: {
  main: '#YOUR_COLOR', // Change this
  light: '#LIGHTER_COLOR',
  dark: '#DARKER_COLOR',
}
```

### Add New Income Category
Edit `src/config/constants.js`:
```javascript
export const INCOME_CATEGORIES = [
  'Salary',
  'Your New Category', // Add here
  'Other',
];
```

### Change Currency Symbol
Edit `src/config/constants.js`:
```javascript
export const DEFAULT_CURRENCY = '₹'; // Change to $, €, etc.
```

### Customize Dashboard Cards
Edit `src/components/Dashboard/Dashboard.jsx`

### Add New Report Chart
Edit `src/components/Reports/Reports.jsx`

---

## Testing Checklist

### Authentication
- [ ] Sign up with email
- [ ] Sign in with email
- [ ] Sign up with Google
- [ ] Sign in with Google
- [ ] Logout works
- [ ] Protected routes redirect to login

### Data Operations
- [ ] Add new entry
- [ ] Edit existing entry
- [ ] Delete entry
- [ ] Data persists after refresh
- [ ] Monthly calculations are correct

### UI/UX
- [ ] Dark mode toggle works
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] Loading states show
- [ ] Error messages appear

### Performance
- [ ] Dashboard loads in <2s
- [ ] Charts render smoothly
- [ ] No lag on input
- [ ] Images load quickly

---

## Debugging

### Check Firebase Connection
```javascript
import { auth, db } from './config/firebase';
console.log(auth);
console.log(db);
```

### View Firestore Data
1. Go to Firebase Console
2. Go to Firestore Database
3. Browse collections
4. Check user documents

### Check Authentication State
```javascript
import { auth } from './config/firebase';
auth.onAuthStateChanged(user => console.log(user));
```

### Browser DevTools
- Press F12 to open
- Console tab for errors
- Network tab for API calls
- Application tab for storage

---

## File Naming Conventions

- **Components**: PascalCase (e.g., `MyComponent.jsx`)
- **Utils**: camelCase (e.g., `myUtility.js`)
- **Config**: camelCase (e.g., `constants.js`)
- **Folders**: camelCase (e.g., `myFolder/`)

---

## Import Aliases (Optional)

Add to `jsconfig.json` or `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@config/*": ["config/*"],
      "@utils/*": ["utils/*"],
      "@components/*": ["components/*"]
    }
  }
}
```

Then use:
```javascript
import { formatCurrency } from '@utils/calculations';
import { auth } from '@config/firebase';
```

---

## Useful Links

- **Firebase Console**: https://console.firebase.google.com
- **Google Cloud Console**: https://console.cloud.google.com
- **Material-UI Docs**: https://mui.com
- **React Docs**: https://react.dev
- **Recharts Docs**: https://recharts.org

---

## Keyboard Shortcuts

- `Ctrl+Shift+M`: Toggle DevTools
- `Ctrl+/`: Toggle theme (if implemented)
- `F5`: Refresh page
- `Ctrl+K`: Search (in IDE)

---

## Performance Tips

1. Use React.memo for expensive components
2. Implement useCallback for event handlers
3. Lazy load routes with React.lazy()
4. Optimize images
5. Monitor Firestore reads/writes

---

## Security Tips

1. Never commit `.env` file
2. Use environment variables for secrets
3. Review Firestore rules regularly
4. Enable 2FA on Firebase account
5. Keep dependencies updated

---

## Resources

- **React Hooks**: https://react.dev/reference/react/hooks
- **Material-UI Components**: https://mui.com/material-ui/api/
- **Firestore Docs**: https://firebase.google.com/docs/firestore
- **Firebase Auth**: https://firebase.google.com/docs/auth

---

## Getting Help

1. Check browser console for errors
2. Check Firebase console for database issues
3. Verify `.env` file is correct
4. Check Firestore rules
5. Clear browser cache: Ctrl+Shift+Delete

---

## Next Steps

1. ✅ Complete setup
2. ✅ Run locally
3. ✅ Test features
4. ✅ Customize colors
5. ✅ Deploy to Firebase
6. ✅ Share with others

---

**Happy Coding!** 🚀
