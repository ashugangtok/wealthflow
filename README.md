# Personal Finance Tracker

A comprehensive web application for tracking income, expenses, credit cards, bank accounts, assets, and liabilities. Built with React, Firebase, and Material-UI.

## Features

### 1. **Authentication**
- Email/Password login and signup
- Google OAuth authentication
- Secure session management with Firebase Auth

### 2. **Dashboard**
- Net worth calculation (Assets - Liabilities)
- Total assets, liabilities, and bank balance
- Monthly income and expense summary
- Credit card outstanding balance
- Upcoming credit card due dates
- Upcoming EMI payments

### 3. **Income Module**
- Add, edit, and delete income entries
- Categorize income (Salary, Freelance, Business, Investment, Bonus, Gift, Other)
- Monthly income summary
- View all income transactions

### 4. **Expense Module**
- Add, edit, and delete expense entries
- 12+ expense categories
- Category-wise expense breakdown
- Monthly expense charts
- Expense trends analysis

### 5. **Credit Card Management**
- Track multiple credit cards
- Monitor credit card balance and limits
- Calculate credit utilization percentage
- Track due dates
- Available credit calculation

### 6. **Bank Account Management**
- Add and manage multiple bank accounts
- Track account balances
- Calculate total cash across all accounts
- Support for Savings, Current, Checking accounts

### 7. **Assets Management**
- Track various asset types (Mutual Funds, Stocks, Gold, FD, Real Estate, Vehicle)
- Monitor asset values
- Track purchase prices and dates
- Calculate total asset value

### 8. **Liabilities Management**
- Track loans and EMIs
- Monitor outstanding amounts
- Calculate monthly EMI payments
- Track loan due dates
- Calculate remaining loan tenure

### 9. **Reports & Analytics**
- 12-month income and expense trends
- Net worth trends
- Category-wise expense distribution (pie charts)
- Category-wise income distribution
- Visual analytics with charts

### 10. **User Interface**
- Responsive Material-UI design
- Dark mode support
- Mobile-friendly layout
- Intuitive navigation
- Real-time data updates

## Tech Stack

- **Frontend**: React 18, React Router v6
- **UI Framework**: Material-UI (MUI) v5
- **Backend**: Firebase
  - Authentication: Firebase Auth
  - Database: Cloud Firestore
  - Hosting: Firebase Hosting
- **Charts**: Recharts
- **Date Handling**: date-fns
- **State Management**: React Context API

## Project Structure

```
personal-finance-app/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── config/
│   │   ├── firebase.js          # Firebase configuration
│   │   ├── constants.js         # App constants (categories, types)
│   │   └── theme.js             # Material-UI themes
│   ├── context/
│   │   ├── AuthContext.jsx      # Authentication context
│   │   └── ThemeContext.jsx     # Theme management context
│   ├── utils/
│   │   ├── firebaseHelpers.js   # Firestore operations
│   │   └── calculations.js      # Financial calculations
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── SignUp.jsx
│   │   ├── Layout/
│   │   │   └── Layout.jsx       # Main layout with sidebar
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   └── UpcomingPayments.jsx
│   │   ├── Income/
│   │   │   ├── Income.jsx
│   │   │   └── IncomeForm.jsx
│   │   ├── Expense/
│   │   │   ├── Expense.jsx
│   │   │   ├── ExpenseForm.jsx
│   │   │   └── ExpenseSummary.jsx
│   │   ├── CreditCard/
│   │   │   ├── CreditCard.jsx
│   │   │   └── CreditCardForm.jsx
│   │   ├── BankAccount/
│   │   │   ├── BankAccount.jsx
│   │   │   └── BankAccountForm.jsx
│   │   ├── Asset/
│   │   │   ├── Asset.jsx
│   │   │   └── AssetForm.jsx
│   │   ├── Liability/
│   │   │   ├── Liability.jsx
│   │   │   └── LiabilityForm.jsx
│   │   ├── Reports/
│   │   │   └── Reports.jsx
│   │   ├── ProtectedRoute.jsx
│   ├── App.jsx                  # Main app component with routing
│   ├── index.js                 # App entry point
│   └── index.css                # Global styles
├── firebase.json                # Firebase configuration
├── firestore.rules              # Firestore security rules
├── package.json
├── .env.example                 # Environment variables template
├── .gitignore
└── README.md                    # This file
```

## Firestore Database Schema

```
users/{userId}
├── uid: string
├── email: string
├── displayName: string
├── photoURL: string
├── createdAt: timestamp
├── currency: string
│
├── income/{incomeId}
│   ├── source: string
│   ├── amount: number
│   ├── category: string
│   ├── date: date
│   ├── notes: string
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│
├── expenses/{expenseId}
│   ├── description: string
│   ├── amount: number
│   ├── category: string
│   ├── date: date
│   ├── notes: string
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│
├── creditCards/{cardId}
│   ├── cardName: string
│   ├── cardNumber: string
│   ├── limitAmount: number
│   ├── outstandingBalance: number
│   ├── dueDate: date
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│
├── bankAccounts/{accountId}
│   ├── accountName: string
│   ├── bankName: string
│   ├── accountNumber: string
│   ├── accountType: string (Savings/Current/Checking)
│   ├── balance: number
│   ├── ifscCode: string
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│
├── assets/{assetId}
│   ├── assetName: string
│   ├── assetType: string
│   ├── quantity: string
│   ├── currentValue: number
│   ├── purchasePrice: number
│   ├── purchaseDate: date
│   ├── notes: string
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│
└── liabilities/{liabilityId}
    ├── loanName: string
    ├── liabilityType: string
    ├── totalAmount: number
    ├── outstandingAmount: number
    ├── emiAmount: number
    ├── emiDueDate: date
    ├── interestRate: number
    ├── startDate: date
    ├── endDate: date
    ├── notes: string
    ├── createdAt: timestamp
    └── updatedAt: timestamp
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- A Firebase account and project

### Step 1: Clone and Setup

```bash
cd Finance
npm install
```

### Step 2: Firebase Configuration

1. Create a new project in [Firebase Console](https://console.firebase.google.com)
2. Create a Web app in your Firebase project
3. Copy your Firebase configuration
4. Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

5. Add your Firebase credentials to `.env`:

```
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Step 3: Enable Firebase Services

In Firebase Console:

1. **Authentication**:
   - Enable Email/Password authentication
   - Enable Google authentication
   - Add your domain to authorized domains

2. **Firestore Database**:
   - Create Firestore database
   - Choose production mode
   - Update firestore.rules with the provided security rules

3. **Hosting** (Optional):
   - Enable Firebase Hosting

### Step 4: Update Firestore Rules

In Firebase Console, replace the Firestore rules with:

```
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

### Step 5: Run Locally

```bash
npm start
```

The app will open at `http://localhost:3000`

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:3000` (for local development)
   - `https://your-domain.com` (for production)
6. Copy the Client ID
7. In Firebase Console:
   - Go to Authentication > Sign-in method
   - Enable Google provider
   - Add your Client ID

## Deployment

### Deploy to Firebase Hosting

#### Prerequisites:
- Firebase CLI installed: `npm install -g firebase-tools`
- Logged in to Firebase: `firebase login`

#### Steps:

1. **Build the project**:
```bash
npm run build
```

2. **Initialize Firebase (if not already done)**:
```bash
firebase init
```

Select:
- Hosting
- Use existing project
- Public directory: `build`
- Single-page app: Yes

3. **Update firebase.json** (if needed):
```json
{
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

4. **Deploy**:
```bash
firebase deploy
```

Your app will be live at: `https://your-project-id.firebaseapp.com`

### Deploy to Other Platforms

#### Vercel:
```bash
npm install -g vercel
vercel
```

#### Netlify:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

#### Docker (Optional):
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Environment Variables

Required environment variables in `.env`:

| Variable | Description |
|----------|-------------|
| `REACT_APP_FIREBASE_API_KEY` | Firebase API Key |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `REACT_APP_FIREBASE_APP_ID` | Firebase App ID |
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | Firebase Measurement ID (optional) |

## Usage Guide

### Creating an Account
1. Click "Sign Up" on the login page
2. Enter email and password (minimum 6 characters)
3. Or sign up with Google

### Adding Income
1. Navigate to Income section
2. Click "Add Income"
3. Fill in source, amount, category, and date
4. Click "Add"

### Tracking Expenses
1. Go to Expenses section
2. Click "Add Expense"
3. Fill in description, amount, category, and date
4. View monthly summary or category breakdown

### Managing Credit Cards
1. Go to Credit Cards section
2. Add card details (name, limit, outstanding balance, due date)
3. View utilization percentage and available credit
4. Track upcoming due dates from dashboard

### Monitoring Net Worth
1. Dashboard shows real-time net worth calculation
2. Add assets and liabilities to get accurate calculations
3. View net worth trends in Reports section

### Viewing Reports
1. Go to Reports section
2. View 12-month trends for income and expenses
3. Analyze net worth growth
4. See category-wise distribution with pie charts

## Security Features

- **Firestore Rules**: Users can only access their own data
- **Authentication**: Secure Firebase authentication with email verification
- **HTTPS**: All data transmitted securely
- **No Sensitive Data**: Card numbers and account numbers stored encrypted
- **Session Management**: Automatic logout on browser close

## Tips & Best Practices

1. **Regular Backups**: Firestore automatically backs up your data
2. **Budget Planning**: Use monthly trends to plan your budget
3. **Track Everything**: The more you log, the better your insights
4. **Review Monthly**: Check reports monthly to identify spending patterns
5. **Set Goals**: Use the dashboard to set and track financial goals

## Troubleshooting

### "Firebase is not initialized"
- Check `.env` file has correct Firebase credentials
- Ensure Firebase project is created

### "Authentication failed"
- Verify Google OAuth credentials in Firebase Console
- Check authorized redirect URIs include your domain
- Clear browser cookies and try again

### "Data not showing"
- Ensure Firestore database is created
- Check Firestore rules are correctly set
- Verify user ID is correct in Firestore document path

### "Build fails"
- Run `npm install` again
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

## Contributing

Feel free to fork, modify, and use this application for your personal finance needs.

## License

MIT License - Feel free to use for personal or commercial projects.

## Support

For issues, questions, or suggestions, please refer to the Firebase documentation and Material-UI docs.

## Future Enhancements

- [ ] Budget alerts and notifications
- [ ] Investment portfolio tracking
- [ ] Tax report generation
- [ ] CSV/PDF export functionality
- [ ] Mobile app (React Native)
- [ ] Bill reminders and notifications
- [ ] Advanced analytics and ML predictions
- [ ] Multi-user household budgeting
- [ ] Integration with bank APIs
- [ ] Cryptocurrency tracking

---

**Made with ❤️ for better financial tracking**
