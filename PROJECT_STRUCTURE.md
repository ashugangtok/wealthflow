# WEALTHFLOW - Project Structure

```
wealthflow/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   └── AuthLayout.tsx
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── KPICard.tsx
│   │   │   ├── CashFlowWidget.tsx
│   │   │   ├── UpcomingBillsWidget.tsx
│   │   │   ├── RecentTransactionsWidget.tsx
│   │   │   └── FinancialHealthScore.tsx
│   │   ├── income/
│   │   │   ├── IncomeModule.tsx
│   │   │   ├── AddIncomeModal.tsx
│   │   │   ├── IncomeChart.tsx
│   │   │   └── IncomeTable.tsx
│   │   ├── expenses/
│   │   │   ├── ExpenseModule.tsx
│   │   │   ├── AddExpenseModal.tsx
│   │   │   ├── ExpenseChart.tsx
│   │   │   ├── ExpenseTable.tsx
│   │   │   └── SmartInsights.tsx
│   │   ├── credit-cards/
│   │   │   ├── CreditCardsModule.tsx
│   │   │   ├── CreditCardVisual.tsx
│   │   │   ├── UtilizationMeter.tsx
│   │   │   └── PaymentHistory.tsx
│   │   ├── bank-accounts/
│   │   │   ├── BankAccountsModule.tsx
│   │   │   ├── AccountCard.tsx
│   │   │   └── CashFlowAnalysis.tsx
│   │   ├── investments/
│   │   │   ├── InvestmentsModule.tsx
│   │   │   ├── PortfolioAllocation.tsx
│   │   │   └── GrowthTrends.tsx
│   │   ├── assets/
│   │   │   ├── AssetsModule.tsx
│   │   │   └── AssetChart.tsx
│   │   ├── liabilities/
│   │   │   ├── LiabilitiesModule.tsx
│   │   │   ├── DebtBreakdown.tsx
│   │   │   └── AmortizationChart.tsx
│   │   ├── goals/
│   │   │   ├── GoalsModule.tsx
│   │   │   ├── GoalCard.tsx
│   │   │   ├── GoalProgress.tsx
│   │   │   └── AddGoalModal.tsx
│   │   ├── house-planner/
│   │   │   ├── HousePlannerModule.tsx
│   │   │   ├── AffordabilityCalculator.tsx
│   │   │   └── EMICalculator.tsx
│   │   ├── subscriptions/
│   │   │   ├── SubscriptionsModule.tsx
│   │   │   └── SubscriptionList.tsx
│   │   ├── ai-advisor/
│   │   │   ├── AIAdvisorPage.tsx
│   │   │   ├── InsightCard.tsx
│   │   │   └── Recommendations.tsx
│   │   ├── reports/
│   │   │   ├── ReportsModule.tsx
│   │   │   ├── MonthlyReport.tsx
│   │   │   ├── YearlyReport.tsx
│   │   │   └── ReportExport.tsx
│   │   ├── settings/
│   │   │   ├── SettingsPage.tsx
│   │   │   ├── ProfileSettings.tsx
│   │   │   ├── NotificationSettings.tsx
│   │   │   └── SecuritySettings.tsx
│   │   ├── shared/
│   │   │   ├── Navigation.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── SkeletonLoader.tsx
│   │   │   └── EmptyState.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── DatePicker.tsx
│   │       ├── Chart.tsx
│   │       ├── Badge.tsx
│   │       ├── Loading.tsx
│   │       └── Toast.tsx
│   ├── services/
│   │   ├── firebase.ts
│   │   ├── auth.ts
│   │   ├── firestore/
│   │   │   ├── users.ts
│   │   │   ├── income.ts
│   │   │   ├── expenses.ts
│   │   │   ├── creditCards.ts
│   │   │   ├── bankAccounts.ts
│   │   │   ├── investments.ts
│   │   │   ├── assets.ts
│   │   │   ├── liabilities.ts
│   │   │   ├── goals.ts
│   │   │   ├── transactions.ts
│   │   │   └── reports.ts
│   │   ├── analytics.ts
│   │   └── notifications.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useFirestore.ts
│   │   ├── useUser.ts
│   │   ├── useIncome.ts
│   │   ├── useExpenses.ts
│   │   ├── useCreditCards.ts
│   │   ├── useFinancialHealth.ts
│   │   └── useNotifications.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── user.ts
│   │   ├── transaction.ts
│   │   ├── creditCard.ts
│   │   ├── investment.ts
│   │   └── goal.ts
│   ├── utils/
│   │   ├── calculations.ts
│   │   ├── formatting.ts
│   │   ├── validation.ts
│   │   ├── constants.ts
│   │   ├── colors.ts
│   │   └── animations.ts
│   ├── styles/
│   │   ├── globals.css
│   │   ├── theme.css
│   │   └── animations.css
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── NotificationContext.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── functions/
│   ├── src/
│   │   ├── index.ts
│   │   ├── calculateFinancialHealth.ts
│   │   ├── generateMonthlyReport.ts
│   │   ├── sendNotifications.ts
│   │   └── aiInsights.ts
│   └── package.json
├── public/
│   └── assets/
├── .env.example
├── .firebaserc
├── firebase.json
├── firestore.rules
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── package.json
└── README.md
```

## Database Schema (Firestore)

### Collections Structure

```
users/
  {userId}/
    - uid: string
    - email: string
    - displayName: string
    - avatar: string
    - createdAt: timestamp
    - updatedAt: timestamp
    - settings: {
        currency: "INR",
        theme: "dark",
        notifications: boolean
      }
    - financialSnapshot: {
        netWorth: number
        totalAssets: number
        totalLiabilities: number
        monthlyIncome: number
        monthlyExpenses: number
      }

income/
  {userId}/
    {docId}/
      - source: string (Salary, Business, Freelance, etc.)
      - amount: number
      - date: timestamp
      - category: string
      - description: string
      - recurring: boolean
      - createdAt: timestamp

expenses/
  {userId}/
    {docId}/
      - description: string
      - amount: number
      - date: timestamp
      - category: string (Food, Travel, Entertainment, etc.)
      - paymentMethod: string
      - tags: array
      - receipt: string (url)
      - createdAt: timestamp

transactions/
  {userId}/
    {docId}/
      - type: "income" | "expense"
      - amount: number
      - date: timestamp
      - category: string
      - description: string
      - source: string
      - createdAt: timestamp

creditCards/
  {userId}/
    {cardId}/
      - cardName: string
      - cardNetwork: string (Visa, Mastercard, etc.)
      - limit: number
      - outstandingAmount: number
      - availableCredit: number
      - dueDate: number (1-31)
      - billingDate: number (1-31)
      - minPayment: number
      - createdAt: timestamp
      - lastUpdated: timestamp

creditCardBills/
  {userId}/
    {billId}/
      - cardId: string
      - statementMonth: string
      - amount: number
      - dueDate: timestamp
      - paidAmount: number
      - paidDate: timestamp
      - status: "pending" | "paid" | "overdue"
      - createdAt: timestamp

bankAccounts/
  {userId}/
    {accountId}/
      - bankName: string
      - accountType: string (Savings, Current, Wallet, etc.)
      - balance: number
      - accountNumber: string (masked)
      - ifscCode: string
      - createdAt: timestamp

investments/
  {userId}/
    {investmentId}/
      - type: string (Stock, MutualFund, Gold, FD, EPF, etc.)
      - name: string
      - currentValue: number
      - investedAmount: number
      - quantity: number
      - purchasePrice: number
      - currentPrice: number
      - annualReturn: number
      - createdAt: timestamp

assets/
  {userId}/
    {assetId}/
      - assetName: string
      - assetType: string (Property, Vehicle, Gold, Business, etc.)
      - purchasePrice: number
      - currentValue: number
      - purchaseDate: timestamp
      - location: string
      - createdAt: timestamp

liabilities/
  {userId}/
    {liabilityId}/
      - loanType: string (Home, Car, Personal, etc.)
      - lenderName: string
      - principalAmount: number
      - outstandingAmount: number
      - interestRate: number
      - emi: number
      - remainingTenure: number (months)
      - nextEMIDate: timestamp
      - createdAt: timestamp

goals/
  {userId}/
    {goalId}/
      - goalName: string
      - goalType: string (Emergency Fund, Home, Trip, etc.)
      - targetAmount: number
      - currentAmount: number
      - targetDate: timestamp
      - priority: "low" | "medium" | "high"
      - status: "active" | "completed" | "paused"
      - createdAt: timestamp

subscriptions/
  {userId}/
    {subscriptionId}/
      - serviceName: string
      - amount: number
      - billingCycle: "monthly" | "yearly"
      - renewalDate: timestamp
      - status: "active" | "cancelled"
      - category: string
      - createdAt: timestamp

notifications/
  {userId}/
    {notificationId}/
      - type: string
      - title: string
      - message: string
      - read: boolean
      - createdAt: timestamp

reports/
  {userId}/
    {reportId}/
      - period: string
      - reportType: "monthly" | "quarterly" | "yearly"
      - generatedAt: timestamp
      - data: object

settings/
  {userId}/
    - currency: string
    - theme: string
    - language: string
    - notifications: object
    - backup: object
```
