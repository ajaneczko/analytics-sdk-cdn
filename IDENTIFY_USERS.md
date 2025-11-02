# 👤 Identify Users - Quick Guide

Track individual users like Intercom! This guide shows you how to identify logged-in users.

## 🚀 Quick Start

```html
<!-- Include the tracker -->
<script src="https://your-username.github.io/analytics-sdk-cdn/analytics.min.js"></script>
<script src="https://your-username.github.io/analytics-sdk-cdn/auto-track.js"></script>

<script>
  // Initialize analytics
  window.analytics = new Analytics({
    endpoint: 'https://analytics-collector-pi.vercel.app',
    orgKey: 'YOUR_ORG_KEY_HERE'
  });

  // After user logs in, identify them
  function handleLogin(user) {
    analytics.identify(user.id, {
      email: user.email,
      name: user.name,
      plan: user.subscription.plan,
      signupDate: user.created_at
    });
    
    // Track login event
    analytics.track('user_logged_in');
  }

  // On logout, clear identification
  function handleLogout() {
    analytics.reset();
    // ... rest of logout logic
  }
</script>
```

## 📋 API Methods

### `analytics.identify(userId, properties)`

Identify a user and store their properties.

**Parameters:**
- `userId` (string, required): Unique identifier for the user
- `properties` (object, optional): User properties

**Common Properties:**
```javascript
{
  email: 'john@example.com',    // User's email
  name: 'John Doe',              // User's full name
  avatar: 'https://...',         // Avatar URL
  plan: 'premium',               // Subscription plan
  company: 'Acme Inc',           // Company name
  signupDate: '2024-01-15',     // Signup date
  // ... any custom properties
}
```

**Example:**
```javascript
analytics.identify('user_12345', {
  email: 'jane@startup.com',
  name: 'Jane Smith',
  plan: 'enterprise',
  company: 'Startup Inc',
  role: 'admin'
});
```

### `analytics.reset()`

Clear user identification (call on logout).

**Example:**
```javascript
analytics.reset();
```

## 🔄 Real-World Examples

### Example 1: Simple Login/Logout

```javascript
// After successful login
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const response = await fetch('/api/login', { /* ... */ });
  const user = await response.json();
  
  // Identify the user
  analytics.identify(user.id, {
    email: user.email,
    name: user.name
  });
  
  window.location = '/dashboard';
});

// On logout button click
document.getElementById('logout-btn').addEventListener('click', () => {
  analytics.reset();
  fetch('/api/logout', { method: 'POST' })
    .then(() => window.location = '/login');
});
```

### Example 2: With Existing Auth System

```javascript
// Check if user is already logged in on page load
const currentUser = getCurrentUser(); // Your auth system

if (currentUser) {
  analytics.identify(currentUser.id, {
    email: currentUser.email,
    name: currentUser.name,
    plan: currentUser.plan
  });
}
```

### Example 3: Update Properties

```javascript
// On signup
analytics.identify(userId, {
  email: user.email,
  name: user.name,
  plan: 'free'
});

// Later, after subscription upgrade
analytics.identify(userId, {
  plan: 'premium'
});
```

## ✅ Best Practices

1. **Call `identify()` as soon as you know who the user is**
   ```javascript
   // ✅ Good: Immediately after login
   analytics.identify(userId, userProps);
   ```

2. **Always call `reset()` on logout**
   ```javascript
   // ✅ Good: Clear on logout
   function logout() {
     analytics.reset();
     // ... other logout logic
   }
   ```

3. **Use consistent user IDs**
   ```javascript
   ✅ analytics.identify('user_12345', { ... });
   ❌ analytics.identify('john@example.com', { ... });
   ```

4. **Don't store sensitive data**
   ```javascript
   ❌ analytics.identify(userId, {
     password: 'secret',      // NEVER
     creditCard: '4111...'    // NEVER
   });
   
   ✅ analytics.identify(userId, {
     email: 'john@example.com', // OK
     plan: 'premium'             // OK
   });
   ```

## 📊 View Your Customers

After identifying users, you'll see them in your dashboard:

1. Go to **Dashboard → Customers**
2. View all identified users
3. See user properties and activity
4. Track user engagement

## 🆘 Troubleshooting

**Users not appearing in dashboard?**
- Check that you're calling `identify()` with correct parameters
- Verify your `orgKey` is correct
- Open browser console and look for errors

**User ID persists after logout?**
- Make sure you're calling `analytics.reset()` on logout
- Check localStorage is not disabled

**Properties not updating?**
- Call `identify()` again with updated properties
- Check browser console for errors

## 📞 Need Help?

- [Full Documentation](./README.md)
- [Customer Tracking Guide](../analytics-monorepo/CUSTOMER_TRACKING.md)

