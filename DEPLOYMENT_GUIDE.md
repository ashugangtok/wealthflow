# Deployment Guide - Personal Finance Tracker

## Quick Start Deployment

### Option 1: Firebase Hosting (Recommended)

#### Prerequisites
```bash
npm install -g firebase-tools
firebase login
```

#### Steps

1. **Build the project**:
```bash
npm run build
```

2. **Initialize Firebase** (if not done):
```bash
firebase init
```
Select:
- Hosting: Yes
- Use existing project: Yes (select your project)
- Public directory: `build`
- Configure as single-page app: Yes
- Set up automatic deploys: No

3. **Deploy**:
```bash
firebase deploy
```

Your app will be live at: `https://your-project-id.firebaseapp.com`

### Option 2: Vercel

#### Install Vercel CLI
```bash
npm install -g vercel
```

#### Deploy
```bash
vercel
```

Select:
- Scope: Your account
- Project name: `personal-finance-app`
- Framework preset: `Create React App`
- Build command: `npm run build`
- Output directory: `build`

Your app will be live at: `https://your-app-name.vercel.app`

### Option 3: Netlify

#### Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Deploy
```bash
netlify deploy --prod --dir=build
```

Your app will be live at: `https://your-app-name.netlify.app`

## Pre-Deployment Checklist

- [ ] Firebase project created
- [ ] `.env` file configured with Firebase credentials
- [ ] Firebase Authentication enabled (Email + Google)
- [ ] Firestore database created
- [ ] Firestore security rules updated
- [ ] Google OAuth credentials configured
- [ ] Project builds without errors: `npm run build`
- [ ] All tests pass (if applicable)
- [ ] Environment variables are set correctly

## Firebase Console Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name
4. Choose region
5. Click "Create project"

### 2. Enable Authentication
1. Go to Authentication > Sign-in method
2. Enable Email/Password
3. Enable Google
4. Add authorized domains

### 3. Create Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Start in production mode
4. Choose region
5. Click "Create"

### 4. Update Firestore Security Rules
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

### 5. Create Web App
1. Go to Project Settings
2. Click "Add app"
3. Select Web
4. Register app
5. Copy Firebase config to `.env` file

### 6. Enable Firebase Hosting (Optional)
1. Go to Hosting
2. Click "Get started"
3. Install Firebase CLI
4. Follow the deployment steps below

## Environment Variables

Create `.env` file in root directory:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Production Checklist

### Security
- [ ] Remove console.log statements
- [ ] Enable HTTPS only
- [ ] Set up security headers
- [ ] Review Firestore rules for security
- [ ] Enable 2FA for Firebase account
- [ ] Disable debug mode in Firebase

### Performance
- [ ] Enable GZIP compression
- [ ] Set up CDN caching
- [ ] Optimize images
- [ ] Minify CSS and JavaScript
- [ ] Enable code splitting

### Monitoring
- [ ] Set up Firebase Analytics
- [ ] Configure error tracking
- [ ] Monitor Firestore usage
- [ ] Set up alerts for quota limits
- [ ] Monitor authentication failures

### Backup & Recovery
- [ ] Enable Firestore automated backups
- [ ] Document disaster recovery plan
- [ ] Test recovery procedures
- [ ] Keep Firebase backup credentials secure

## Custom Domain Setup

### Firebase Hosting with Custom Domain

1. Go to Firebase Hosting
2. Click "Connect domain"
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-48 hours)

### Update OAuth Credentials

1. Go to Google Cloud Console
2. Update authorized redirect URIs:
   ```
   https://yourdomain.com
   https://www.yourdomain.com
   ```
3. Update Firebase authorized domains in console

## Monitoring & Maintenance

### Firebase Dashboard Checks
- Monitor Firestore read/write operations
- Check Authentication usage
- Monitor Hosting traffic
- Review error rates

### Regular Maintenance
- Update dependencies monthly: `npm update`
- Review and optimize Firestore queries
- Clean up old data if needed
- Test new features on staging first

## Scaling Considerations

### Database
- Monitor Firestore usage
- Consider sharding if needed
- Archive old data to reduce costs

### Hosting
- Firebase Hosting auto-scales
- Monitor request rates
- Consider CDN for static assets

### Authentication
- Monitor login failure rates
- Implement rate limiting if needed
- Review access logs

## Cost Optimization

### Firebase
- Use Firestore indexes wisely
- Optimize query patterns
- Archive old data
- Monitor and set quotas

### Hosting
- Use CDN caching
- Compress assets
- Optimize images
- Monitor bandwidth usage

## Troubleshooting

### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deployment Issues
```bash
# Check Firebase CLI login
firebase login

# Verify firebase.json exists
firebase init

# Check build directory
ls build/
```

### Runtime Errors
- Check browser console for errors
- Check Firebase console for quota limits
- Verify Firestore rules are correct
- Check environment variables in deployment

## Rollback Procedure

### Firebase Hosting
```bash
# View previous releases
firebase hosting:channel:list

# Promote a previous release
firebase hosting:clone SOURCE_RELEASE LIVE
```

## Support & Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Material-UI Documentation](https://mui.com)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

---

**Last Updated**: 2024
