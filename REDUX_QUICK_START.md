# MindCare Redux Integration - Quick Start Guide

## 🚀 **What's Been Added**

### Redux State Management
- **Redux Toolkit** for modern Redux patterns
- **Auth Slice**: User authentication, registration, profile management
- **Session Slice**: Therapy session management
- **Resource Slice**: Mental health resource management

### Enhanced Components
- **Login**: Redux-powered with sample credential buttons
- **Register**: Full validation and role selection (Patient/Psychiatrist)
- **Dashboard**: Dynamic data from Redux store
- **Resources**: Will use Redux (existing API integration remains)
- **Sessions**: Will use Redux (existing API integration remains)

## 🛠️ **How to Test**

### 1. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

### 2. Seed the Database (if not done already)
```bash
cd server
npm run seed
```

### 3. Test User Registration

1. Go to: http://localhost:3000/register
2. Fill out the registration form:
   - **Name**: Your Name
   - **Email**: test@example.com
   - **Role**: Choose Patient or Psychiatrist
   - **Password**: password123 (minimum 6 characters)
   - **Confirm Password**: password123

3. Click "Create Account"
4. You should see success message and redirect to login

### 4. Test User Login

**Option A - Use Sample Credentials:**
1. Go to: http://localhost:3000/login
2. Click "Patient Login" or "Psychiatrist Login" buttons
3. Credentials will auto-fill
4. Click "Login"

**Option B - Manual Login:**
Use any of these sample accounts:

**Patients:**
- Email: `john.doe@email.com` | Password: `password123`
- Email: `alice.smith@email.com` | Password: `password123`

**Psychiatrists:**
- Email: `maya.singh@mindcare.com` | Password: `password123`
- Email: `ali.tan@mindcare.com` | Password: `password123`

### 5. Test Dashboard

After login, you should see:
- **Personalized Welcome**: Shows your name from Redux store
- **Upcoming Sessions**: Fetched dynamically via Redux
- **Resource Count**: Total resources from database
- **Profile Info**: Role and member since date

## 🔍 **Redux DevTools**

Install Redux DevTools browser extension to see:
- State changes in real-time
- Action dispatching
- Time-travel debugging

## 📱 **Features to Test**

### Authentication Flow
- ✅ Register new users
- ✅ Login with validation
- ✅ Error handling (wrong credentials)
- ✅ Auto-redirect after login
- ✅ Profile data persistence

### State Management
- ✅ User data stored in Redux
- ✅ Session data fetched and cached
- ✅ Resource count tracking
- ✅ Loading states
- ✅ Error states

### Form Validation
- ✅ Email format validation
- ✅ Password length validation
- ✅ Password confirmation matching
- ✅ Real-time field validation
- ✅ Server error display

## 🐛 **Common Issues & Solutions**

### "Cannot read properties of undefined"
- **Cause**: Redux store not initialized
- **Solution**: Make sure Provider wraps App in index.js

### Login redirects to login page
- **Cause**: Token not being set properly
- **Solution**: Check browser localStorage for 'token'

### Sample credential buttons not working
- **Cause**: Database not seeded
- **Solution**: Run `npm run seed` in server directory

### API calls failing
- **Cause**: Backend not running
- **Solution**: Ensure backend is running on port 5000

## 🎯 **Next Steps**

The remaining components (Resources and Sessions pages) still use direct API calls. You can:

1. **Update Resources Component**: Replace direct API calls with Redux actions
2. **Update Sessions Component**: Replace direct API calls with Redux actions
3. **Add More Features**: Profile editing, session booking, etc.

## 📊 **Redux Store Structure**

```javascript
{
  auth: {
    user: { name, email, role, ... },
    token: "jwt_token",
    isAuthenticated: true,
    isLoading: false,
    error: null
  },
  sessions: {
    sessions: [...],
    upcomingSessions: [...],
    psychiatrists: [...],
    isLoading: false
  },
  resources: {
    resources: [...],
    total: 6,
    categories: [...],
    types: [...]
  }
}
```

## 🎉 **Success Indicators**

You'll know everything is working when:
- ✅ Registration creates new users in MongoDB
- ✅ Login stores JWT token and user data in Redux
- ✅ Dashboard shows personalized data
- ✅ Navigation between pages maintains auth state
- ✅ Logout clears Redux state and redirects

---

**Happy Testing! 🎊**
