# ⚡ Quick Integration Guide

How to identify users with your login form (email + username).

## 🎯 The Key Part

After your login API returns success, call this:

```javascript
// ✅ After successful login
analytics.identify(user.id, {
  email: email,        // From your form
  name: username,      // Using username as name
  username: username   // Also store as separate property
});

// Track the login event
analytics.track('user_logged_in');
```

## 📝 Complete Example

```javascript
// 1. Initialize analytics (in your <head> or main JS file)
<script src="https://ajaneczko.github.io/analytics-sdk-cdn/analytics.min.js"></script>
<script src="https://ajaneczko.github.io/analytics-sdk-cdn/auto-track.js"></script>

<script>
  window.analytics = new Analytics({
    endpoint: 'https://analytics-collector-pi.vercel.app',
    orgKey: 'YOUR_ORG_KEY_HERE'
  });
</script>

// 2. In your login form handler
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Call your login API
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password })
  });

  const data = await response.json();

  if (data.success) {
    // ✨ IDENTIFY THE USER
    analytics.identify(data.user.id, {
      email: email,
      name: username,
      username: username,
      // Add more properties if available
      plan: data.user.plan,
      company: data.user.company,
      signupDate: data.user.created_at
    });

    // Track login
    analytics.track('user_logged_in');

    // Redirect to dashboard
    window.location.href = '/dashboard';
  }
});

// 3. On logout button click
document.getElementById('logout-btn').addEventListener('click', () => {
  // ✨ CLEAR IDENTIFICATION
  analytics.reset();
  
  // Your logout logic
  fetch('/api/logout', { method: 'POST' })
    .then(() => window.location.href = '/login');
});
```

## 🔄 What Happens

### After Login:
1. User fills in email and username
2. Login API validates credentials
3. `analytics.identify()` creates/updates customer in `abax_analytics_app.customers`:
   ```json
   {
     "_id": "...",
     "organization_id": "your_org_id",
     "user_id": "user_123",
     "email": "john@example.com",
     "name": "johndoe",
     "username": "johndoe",
     "properties": {
       "plan": "premium",
       "company": "Acme Inc"
     },
     "first_seen_at": "2024-11-02T10:00:00Z",
     "last_seen_at": "2024-11-02T10:00:00Z",
     "status": "active"
   }
   ```
4. All future events include `user_id: "user_123"`
5. Customer appears in Dashboard → Customers

### After Logout:
1. `analytics.reset()` clears localStorage
2. Future events no longer linked to user
3. Customer status updates to "inactive" after 30 minutes

## 📊 View in Dashboard

Go to: **Dashboard → Customers**

You'll see:
- ✅ Email: `john@example.com`
- ✅ Name: `johndoe` (from username)
- ✅ Status: Online/Active/Inactive
- ✅ Last Seen: Just now
- ✅ All their events and activity

## 🎨 Customization Options

### Option 1: Use username as display name
```javascript
analytics.identify(userId, {
  email: email,
  name: username,  // Display name = username
  username: username
});
```

### Option 2: Ask for full name separately
If you have a "full name" field:
```javascript
analytics.identify(userId, {
  email: email,
  name: fullName,     // John Doe
  username: username, // johndoe
});
```

### Option 3: Split name later
Parse username or email for display:
```javascript
analytics.identify(userId, {
  email: 'john.doe@example.com',
  name: 'john.doe',  // From email before @
  username: username
});
```

## ✨ Additional Properties

You can track more user data:

```javascript
analytics.identify(userId, {
  email: email,
  name: username,
  username: username,
  
  // Profile info
  avatar: user.avatar_url,
  phone: user.phone,
  
  // Account info
  plan: 'premium',
  role: 'admin',
  company: 'Acme Inc',
  
  // Metadata
  signupDate: '2024-01-15',
  emailVerified: true,
  language: 'en',
  timezone: 'America/New_York',
  
  // Custom properties
  preferences: { theme: 'dark' },
  tags: ['beta-tester', 'power-user']
});
```

## 🔐 Security Notes

**✅ Safe to Track:**
- Email
- Username
- Name
- Plan/subscription
- Role
- Company
- Preferences

**❌ Never Track:**
- Passwords
- Credit card numbers
- Social security numbers
- Private API keys
- Personal identification numbers

## 📱 Works With

- ✅ Plain HTML forms
- ✅ React/Next.js
- ✅ Vue.js
- ✅ Angular
- ✅ Any JavaScript framework

## 🆘 Troubleshooting

**Users not appearing?**
1. Check browser console for errors
2. Verify `orgKey` is correct
3. Make sure you're calling `identify()` after successful login
4. Check that your API returns a user ID

**Properties not saving?**
1. Make sure properties object is valid JSON
2. Don't use `undefined` values (use `null` instead)
3. Check the `/api/customers/identify` endpoint is accessible

**User stays logged in after logout?**
1. Make sure you're calling `analytics.reset()`
2. Check localStorage is cleared: `localStorage.getItem('analytics_user_id')`

## 📚 Full Documentation

- [Complete Customer Tracking Guide](../analytics-monorepo/CUSTOMER_TRACKING.md)
- [Detailed Identify Guide](./IDENTIFY_USERS.md)
- [Full Example](./LOGIN_FORM_EXAMPLE.html)

