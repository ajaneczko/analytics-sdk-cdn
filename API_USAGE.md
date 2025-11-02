# 📖 Analytics SDK - API Usage Guide

The SDK now supports **two API styles** for maximum compatibility!

## 🎨 Two Ways to Use

### **Option 1: Static API** (Simple & Clean)

Perfect for simple apps. One global instance.

```javascript
// Initialize once
Analytics.init({
  endpoint: 'https://analytics-collector-pi.vercel.app',
  orgKey: 'YOUR_ORG_KEY'
});

// Use static methods
Analytics.identify('user_123', {
  email: 'john@example.com',
  name: 'John Doe'
});

Analytics.track('button_clicked', {
  button_id: 'checkout'
});

Analytics.reset(); // On logout
```

### **Option 2: Instance API** (More Control)

Perfect for advanced use cases or multiple instances.

```javascript
// Create instance
const analytics = new Analytics({
  endpoint: 'https://analytics-collector-pi.vercel.app',
  orgKey: 'YOUR_ORG_KEY'
});

// Use instance methods
analytics.identify('user_123', {
  email: 'john@example.com',
  name: 'John Doe'
});

analytics.track('button_clicked', {
  button_id: 'checkout'
});

analytics.reset(); // On logout
```

---

## ✅ Both APIs Work!

| Method | Static API | Instance API |
|--------|-----------|--------------|
| **Initialize** | `Analytics.init(config)` | `new Analytics(config)` |
| **Identify** | `Analytics.identify(...)` | `analytics.identify(...)` |
| **Track** | `Analytics.track(...)` | `analytics.track(...)` |
| **Page View** | `Analytics.trackPageView(...)` | `analytics.trackPageView(...)` |
| **Reset** | `Analytics.reset()` | `analytics.reset()` |

---

## 📝 Complete Examples

### Example 1: Static API with Login

```html
<script src="https://ajaneczko.github.io/analytics-sdk-cdn/analytics.min.js"></script>
<script src="https://ajaneczko.github.io/analytics-sdk-cdn/auto-track.js"></script>

<script>
  // Initialize once at app start
  Analytics.init({
    endpoint: 'https://analytics-collector-pi.vercel.app',
    orgKey: 'YOUR_ORG_KEY',
    debug: true
  });

  // After user logs in
  function handleLogin(user) {
    Analytics.identify(user.id, {
      email: user.email,
      name: user.username,
      plan: user.plan
    });
    
    Analytics.track('user_logged_in');
  }

  // On logout
  function handleLogout() {
    Analytics.track('user_logged_out');
    Analytics.reset();
  }
</script>
```

### Example 2: Instance API with React/Next.js

```javascript
// lib/analytics.ts
import { useEffect } from 'react';

export const analytics = new window.Analytics({
  endpoint: 'https://analytics-collector-pi.vercel.app',
  orgKey: process.env.NEXT_PUBLIC_ORG_KEY,
  debug: process.env.NODE_ENV === 'development'
});

// components/AnalyticsProvider.tsx
export function AnalyticsProvider({ user, children }) {
  useEffect(() => {
    if (user) {
      analytics.identify(user.id, {
        email: user.email,
        name: user.name
      });
    } else {
      analytics.reset();
    }
  }, [user]);

  return children;
}

// Any component
import { analytics } from '@/lib/analytics';

function MyComponent() {
  const handleClick = () => {
    analytics.track('feature_used', { feature: 'export' });
  };
  
  return <button onClick={handleClick}>Export</button>;
}
```

### Example 3: Mixing Both APIs

You can even mix them!

```javascript
// Initialize with static API
Analytics.init({
  endpoint: 'https://analytics-collector-pi.vercel.app',
  orgKey: 'YOUR_ORG_KEY'
});

// Access the instance via window.analytics (auto-created by init)
console.log(window.analytics); // Available!

// Use static methods
Analytics.identify('user_123', { ... });

// OR use instance methods (same thing!)
window.analytics.identify('user_123', { ... });
```

---

## 🔄 Migration Guide

### If You're Using Old API:

**Before (Old way - instance only):**
```javascript
const analytics = new Analytics(config);
analytics.identify(...);
```

**After (Both work!):**
```javascript
// Option A: Keep using instance API
const analytics = new Analytics(config);
analytics.identify(...);

// Option B: Switch to static API
Analytics.init(config);
Analytics.identify(...);
```

### If You Had Errors:

**Error:** `Analytics.init is not a function`
**Fix:** ✅ Now supported! Just clear cache and reload.

**Error:** `window.Analytics.identify is not a function`
**Fix:** ✅ Now supported! Static methods work now.

---

## 🚀 Which Should I Use?

### Use **Static API** if:
- ✅ You have a simple app with one tracker
- ✅ You want cleaner, shorter code
- ✅ You prefer global access everywhere
- ✅ You're migrating from another SDK

```javascript
Analytics.init(config);
Analytics.track('event');
```

### Use **Instance API** if:
- ✅ You need multiple tracker instances
- ✅ You want more control over lifecycle
- ✅ You prefer explicit dependencies
- ✅ You're building a library/framework

```javascript
const analytics = new Analytics(config);
analytics.track('event');
```

---

## 🎯 Common Patterns

### Pattern 1: Initialize Early

```javascript
// At the top of your main app file
Analytics.init({
  endpoint: 'https://analytics-collector-pi.vercel.app',
  orgKey: 'YOUR_ORG_KEY'
});

// Now use anywhere in your app
Analytics.track('app_loaded');
```

### Pattern 2: Conditional Initialization

```javascript
// Only in production
if (process.env.NODE_ENV === 'production') {
  Analytics.init({
    endpoint: 'https://analytics-collector-pi.vercel.app',
    orgKey: process.env.NEXT_PUBLIC_ORG_KEY
  });
}
```

### Pattern 3: With Auto-Track

```javascript
// Load both scripts
<script src=".../analytics.min.js"></script>
<script src=".../auto-track.js"></script>

<script>
  Analytics.init({
    endpoint: 'https://analytics-collector-pi.vercel.app',
    orgKey: 'YOUR_ORG_KEY'
  });
  
  // Clicks are now auto-tracked!
  // Just add data-ga-id to elements
</script>

<button data-ga-id="checkout-btn">Checkout</button>
```

### Pattern 4: User Session Management

```javascript
// On app init
Analytics.init(config);

// Check if user is already logged in
const currentUser = getCurrentUser();
if (currentUser) {
  Analytics.identify(currentUser.id, {
    email: currentUser.email,
    name: currentUser.name
  });
}

// On login
function onLogin(user) {
  Analytics.identify(user.id, { ... });
}

// On logout
function onLogout() {
  Analytics.reset();
}
```

---

## 🔧 Advanced Usage

### Multiple Instances (Instance API Only)

```javascript
// Track different products separately
const mainAppAnalytics = new Analytics({
  endpoint: 'https://analytics-collector-pi.vercel.app',
  orgKey: 'main-app-key'
});

const widgetAnalytics = new Analytics({
  endpoint: 'https://analytics-collector-pi.vercel.app',
  orgKey: 'widget-key'
});

mainAppAnalytics.track('app_event');
widgetAnalytics.track('widget_event');
```

### Access Global Instance

```javascript
// When using Analytics.init(), instance is also available as:
Analytics.init(config);

// All three are the same:
Analytics.identify(userId, props);
window.Analytics.identify(userId, props);
window.analytics.identify(userId, props);
```

---

## ⚠️ Important Notes

1. **Call `init()` or `new Analytics()` only once** - Don't reinitialize
2. **Static methods require initialization** - Call `Analytics.init()` first
3. **Auto-track works with both APIs** - No difference
4. **User identification persists** - Stored in localStorage

---

## 💡 Tips

- Use `debug: true` during development to see console logs
- Call `identify()` after every login (handles updates automatically)
- Always call `reset()` on logout to clear user data
- Check browser console for helpful warnings and errors

---

## 📚 More Documentation

- [Quick Integration Guide](./QUICK_INTEGRATION.md)
- [Customer Tracking Guide](./IDENTIFY_USERS.md)
- [Flow Diagrams](./FLOW_DIAGRAM.md)
- [Full Documentation](../analytics-monorepo/CUSTOMER_TRACKING.md)

