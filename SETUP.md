# Setup Guide - Personal Finance Tracker

## Table of Contents
1. [Initial Setup](#initial-setup)
2. [Firebase Configuration](#firebase-configuration)
3. [Local Development](#local-development)
4. [Deployment](#deployment)

## Initial Setup

### Step 1: Clone/Download the Project

```bash
# Navigate to the project directory
cd Finance

# Install dependencies
npm install
```

### Step 2: Create Environment File

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` and add your Firebase credentials.

## Firebase Configuration

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add Project"**
3. Enter project name (e.g., "personal-finance-app")
4. Choose default location
5. Click **"Create Project"**

### Step 2: Register Web App

1. In Firebase Console, click **"Add App"**
2. Select **"Web"** (</> icon)
3. Enter app nickname (e.g., "Finance Tracker Web")
4. Click **"Register App"**
5. Copy the Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
};
```

### Step 3: Update .env File

Paste your Firebase credentials into `.env`:

```
REACT_APP_FIREBASE_API_KEY=AIzaSyC...
REACT_APP_FIREBASE_AUTH_DOMAIN=finance-app.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=finance-app-12345
REACT_APP_FIREBASE_STORAGE_BUCKET=finance-app-12345.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef...
REACT_APP_FIREBASE_MEASUREMENT_ID=G-ABCDEFGH
```

### Step 4: Enable Authentication

#### Email/Password Authentication:
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click **"Email/Password"**
3. Toggle **"Enable"**
4. Click **"Save"**

#### Google Authentication:
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click **"Google"**
3. Toggle **"Enable"**
4. Select your project support email
5. Click **"Save"**

#### Configure Authorized Domains:
1. Go to **Authentication** > **Settings**
2. Under "Authorized domains", click **"Add domain"**
3. Add:
   - `localhost` (for local development)
   - `127.0.0.1` (for local development)
   - Your deployed domain (e.g., `your-app.firebaseapp.com`)

### Step 5: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **"Create Database"**
3. Choose **"Start in production mode"**
4. Select your preferred region (closest to you)
5. Click **"Create"**

### Step 6: Update Firestore Security Rules

1. In Firestore Database, go to **Rules** tab
2. Replace the default rules with:

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

3. Click **"Publish"**

### Step 7: Configure Google OAuth (Optional but Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Go to **APIs & Services** > **OAuth consent screen**
4. Click **"Create"** or **"Edit"**
5. Fill in:
   - App name: "Personal Finance Tracker"
   - User support email: your email
   - Developer contact: your email
6. Click **"Save & Continue"**
7. Go to **Credentials**
8. Click **"Create Credentials"** > **"OAuth 2.0 Client ID"**
9. Choose **"Web application"**
10. Add Authorized redirect URIs:
    - `http://localhost:3000`
    - `http://localhost:3000/` (with trailing slash)
    - `https://your-domain.com` (your deployed domain)
11. Click **"Create"**
12. Copy your Client ID

### Step 8: Add Google OAuth to Firebase

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click **"Google"**
3. Under "Web SDK configuration", click **"Get config"**
4. Your Web Client ID should auto-populate
5. Click **"Save"**

## Local Development

### Run Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

### Features to Test Locally

1. **Authentication**
   - Sign up with email/password
   - Sign up with Google
   - Sign in with existing account
   - Logout

2. **Dashboard**
   - Verify net worth calculation
   - Check metric cards load data
   - View upcoming payments

3. **Income Module**
   - Add new income entry
   - Edit existing income
   - Delete income entry
   - View monthly total

4. **Expense Module**
   - Add new expense entry
   - View expense list
   - Check expense summary
   - Verify category breakdown

5. **Credit Cards**
   - Add credit card
   - View utilization percentage
   - Check outstanding balance

6. **Bank Accounts**
   - Add bank account
   - View total balance

7. **Assets & Liabilities**
   - Add assets
   - Add liabilities with EMI
   - Verify calculations

8. **Reports**
   - View income/expense trends
   - Check category distribution
   - Verify net worth trend

### Debugging

Enable React DevTools:
```bash
# Install React Developer Tools browser extension
# Available for Chrome and Firefox
```

Check browser console for errors:
- Press F12 or right-click > Inspect
- Go to Console tab
- Look for red error messages

## Deployment

### Firebase Hosting (Recommended)

#### Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

#### Build and Deploy

```bash
# Build the project
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

Your app will be live at: `https://your-project-id.firebaseapp.com`

#### Update Environment for Production

Update your `.env` or create `.env.production`:

```
REACT_APP_FIREBASE_API_KEY=your_production_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
...
```

### Alternative Deployment Options

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

## Verification Checklist

After setup, verify:

- [ ] `.env` file created with Firebase credentials
- [ ] Firebase project created and web app registered
- [ ] Authentication enabled (Email/Password + Google)
- [ ] Firestore database created
- [ ] Firestore security rules updated
- [ ] Authorized domains configured
- [ ] Google OAuth credentials configured (optional)
- [ ] `npm start` runs without errors
- [ ] Can sign up with email/password
- [ ] Can sign up with Google
- [ ] Can access dashboard after login
- [ ] Can add income/expense entries
- [ ] Data persists after refresh
- [ ] Can logout
- [ ] Dark mode toggle works

## Troubleshooting

### "Firebase is not initialized"
**Problem**: App crashes with Firebase initialization error

**Solution**:
1. Check `.env` file has all required variables
2. Verify credentials are copied correctly
3. Check for extra spaces in `.env`
4. Restart development server: `npm start`

### "Authentication failed"
**Problem**: Cannot sign in or sign up

**Solution**:
1. Verify email/password authentication is enabled
2. Check authorized domains include `localhost`
3. For Google: Verify OAuth credentials are correct
4. Clear browser cookies and try again

### "Data not saving to Firestore"
**Problem**: Can add data but it doesn't appear in Firestore

**Solution**:
1. Check Firestore database is created
2. Verify security rules are updated
3. Check browser console for errors
4. Verify user is logged in
5. Check Firestore quota hasn't been exceeded

### "Build fails with npm run build"
**Problem**: Build command exits with error

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

### Port 3000 already in use
**Problem**: Cannot start development server

**Solution**:
```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -i :3000
kill -9 <PID>

# Or use a different port
PORT=3001 npm start
```

## Next Steps

1. **Customize Theme** (optional)
   - Edit `src/config/theme.js`
   - Change colors, fonts, spacing

2. **Add More Features** (optional)
   - Budget alerts
   - Recurring transactions
   - CSV export

3. **Set Up Custom Domain** (for production)
   - Register domain
   - Update Firebase hosting
   - Update Google OAuth credentials

4. **Enable Analytics** (optional)
   - Go to Firebase > Analytics
   - Set up Google Analytics
   - Track user behavior

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Material-UI Documentation](https://mui.com)
- [GitHub Issues](https://github.com)

---

**Happy Tracking!** 💰📊
