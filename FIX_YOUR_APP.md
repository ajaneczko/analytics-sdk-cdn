# 🔧 Fix Your App - Static API Usage

## 🎯 Your Error Messages:

```
❌ Uncaught TypeError: Analytics.init is not a function
❌ TypeError: window.Analytics.identify is not a function
```

## ✅ Solution: Static API Now Supported!

I've added support for the static API your app is using. Just **clear your browser cache** and it will work!

---

## 📝 How Your App Should Look:

### Step 1: Load the SDK

```html
<script src="https://ajaneczko.github.io/analytics-sdk-cdn/analytics.min.js"></script>
<script src="https://ajaneczko.github.io/analytics-sdk-cdn/auto-track.js"></script>
```

### Step 2: Initialize with `Analytics.init()`

```javascript
// Initialize ONCE at app startup
Analytics.init({
  endpoint: 'https://analytics-collector-pi.vercel.app',
  orgKey: 'YOUR_ORG_KEY_HERE'
});
```

### Step 3: Use Static Methods

```javascript
// Identify user after login
Analytics.identify('user_123', {
  email: 'john@example.com',
  name: 'johndoe'
});

// Track events
Analytics.track('page_viewed');
Analytics.track('button_clicked', { button: 'checkout' });

// Reset on logout
Analytics.reset();
```

---

## 🚀 Complete Example for Your App

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Load Analytics SDK -->
  <script src="https://ajaneczko.github.io/analytics-sdk-cdn/analytics.min.js"></script>
  <script src="https://ajaneczko.github.io/analytics-sdk-cdn/auto-track.js"></script>
  
  <script>
    // Initialize once
    Analytics.init({
      endpoint: 'https://analytics-collector-pi.vercel.app',
      orgKey: 'YOUR_ORG_KEY', // Get from Dashboard → Organization
      debug: true // Set false in production
    });
    
    console.log('✅ Analytics initialized!');
  </script>
</head>
<body>
  
  <!-- Your login form -->
  <form id="login-form">
    <input type="email" id="email" required />
    <input type="text" id="username" required />
    <button type="submit">Login</button>
  </form>

  <script>
    // After login
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const username = document.getElementById('username').value;
      
      // Your login API call
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // ✅ Identify user with static method
        Analytics.identify(data.user.id, {
          email: email,
          name: username,
          username: username,
          plan: data.user.plan
        });
        
        // ✅ Track login event
        Analytics.track('user_logged_in');
        
        // Redirect
        window.location.href = '/dashboard';
      }
    });
    
    // On logout
    function handleLogout() {
      // ✅ Clear user identification
      Analytics.reset();
      
      // Your logout logic
      fetch('/api/logout', { method: 'POST' })
        .then(() => window.location.href = '/login');
    }
  </script>

</body>
</html>
```

---

## 🔄 For Next.js / React Apps

### In your layout or app component:

```javascript
'use client'; // If using Next.js App Router

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function RootLayout({ children }) {
  const { data: session } = useSession();

  useEffect(() => {
    // Initialize once on app load
    if (typeof window !== 'undefined' && window.Analytics) {
      Analytics.init({
        endpoint: 'https://analytics-collector-pi.vercel.app',
        orgKey: process.env.NEXT_PUBLIC_ORG_KEY,
        debug: process.env.NODE_ENV === 'development'
      });
    }
  }, []);

  useEffect(() => {
    // Identify user when session changes
    if (session?.user) {
      Analytics.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name
      });
    } else {
      Analytics.reset();
    }
  }, [session]);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

### In any component:

```javascript
function MyComponent() {
  const handleClick = () => {
    Analytics.track('button_clicked', {
      button: 'export',
      page: window.location.pathname
    });
  };

  return <button onClick={handleClick}>Export</button>;
}
```

---

## 🧹 Clear Browser Cache

**IMPORTANT:** You must clear your browser cache to get the updated SDK!

### Quick Method (DevTools):
1. Open DevTools: `F12`
2. Go to **Network** tab
3. Check **"Disable cache"**
4. Refresh: `Ctrl + F5` or `Cmd + Shift + R`

### Chrome / Edge:
1. `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Select "Cached images and files"
3. Click "Clear data"
4. Hard refresh: `Ctrl + F5`

### Firefox:
1. `Ctrl + Shift + Delete`
2. Select "Cache"
3. Click "Clear Now"
4. Hard refresh: `Ctrl + F5`

---

## ✅ Verify It's Working

Open browser console and check:

```javascript
// Should see this on page load:
// [Analytics] ✅ SDK loaded successfully
// [Analytics] 💡 Usage: Analytics.init(config) or new Analytics(config)
// [Analytics] Analytics SDK initialized

// Test manually:
Analytics.identify('test_123', { email: 'test@example.com' });
// Should see: [Analytics] Identifying user: {...}
```

---

## 🎯 API Reference

| Method | Usage | Description |
|--------|-------|-------------|
| `Analytics.init(config)` | Initialize SDK | Call once at app start |
| `Analytics.identify(userId, props)` | Identify user | Call after login |
| `Analytics.track(eventName, props)` | Track event | Track any action |
| `Analytics.trackPageView(props)` | Track page view | Usually auto-tracked |
| `Analytics.reset()` | Clear user | Call on logout |

---

## 💡 Pro Tips

1. **Initialize Early:** Call `Analytics.init()` as soon as possible
2. **Debug Mode:** Use `debug: true` during development
3. **Check Console:** Look for `[Analytics]` messages
4. **Persistent ID:** User stays identified across page reloads
5. **Auto-Track:** Add `data-ga-id` to buttons for automatic click tracking

---

## 🆘 Still Having Issues?

### Issue 1: "Analytics is not defined"
**Solution:** Make sure scripts load before your code:
```html
<!-- Load SDK first -->
<script src=".../analytics.min.js"></script>

<!-- Then use it -->
<script>
  Analytics.init(...);
</script>
```

### Issue 2: "Not initialized" warning
**Solution:** Call `Analytics.init()` before other methods:
```javascript
Analytics.init(config);  // Do this first
Analytics.identify(...); // Then use
```

### Issue 3: Events not showing in dashboard
**Solution:** 
1. Check `orgKey` is correct (from Dashboard → Organization)
2. Open browser console for error messages
3. Verify endpoint is reachable
4. Wait a few seconds for data to sync

---

## 📚 More Help

- [Complete API Guide](./API_USAGE.md)
- [Quick Integration](./QUICK_INTEGRATION.md)
- [Customer Tracking](./IDENTIFY_USERS.md)

---

**Summary:**
1. ✅ Clear browser cache
2. ✅ Use `Analytics.init()` to initialize
3. ✅ Use `Analytics.identify()`, `Analytics.track()`, etc.
4. ✅ Check browser console for confirmations

Your app should work now! 🎉

