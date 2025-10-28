# Analytics SDK CDN

Browser-ready analytics SDK for event tracking. No build tools required!

## 🚀 Quick Start

```html
<script src="https://YOUR-USERNAME.github.io/analytics-sdk-cdn/analytics.min.js"></script>
<script>
  Analytics.init({
    endpoint: 'https://your-collector.com',
    siteId: 'my-website',
    debug: true
  });
  
  // That's it! Page views are automatically tracked.
  // Track custom events:
  Analytics.track('button_click', { buttonId: 'cta' });
</script>
```

## 📊 Demo

[View Live Demo](https://YOUR-USERNAME.github.io/analytics-sdk-cdn/)

## 📖 API Reference

### Initialize

```javascript
Analytics.init({
  endpoint: 'https://analytics.yourcompany.com',  // Required: Your collector URL
  siteId: 'my-website',                          // Required: Site identifier
  ingestionKey: 'optional-secret-key',           // Optional: Auth key
  debug: false,                                  // Optional: Console logging
  batchSize: 10,                                 // Optional: Events before auto-send
  flushInterval: 5000                            // Optional: Auto-send interval (ms)
});
```

### Track Events

```javascript
// Custom events
Analytics.track('button_click', { buttonId: 'hero-cta', text: 'Get Started' });
Analytics.track('purchase', { amount: 99.99, currency: 'USD', productId: 'prod_123' });

// Page views (automatic on init, or manual)
Analytics.trackPageView({ section: 'pricing', category: 'saas' });

// User identification
Analytics.setUserId('user-abc-123');
Analytics.setUserProps({ plan: 'premium', country: 'US' });

// Manual flush (force send now)
await Analytics.flush();
```

## ✨ Features

- ✅ **Zero dependencies** - Just 5KB
- ✅ **Auto page tracking** - Tracks initial page view
- ✅ **UTM extraction** - Automatically captures campaign data
- ✅ **Batching** - Efficient event batching
- ✅ **Persistent ID** - Client ID stored in localStorage
- ✅ **sendBeacon** - Reliable tracking on page unload
- ✅ **GDPR friendly** - IP anonymization & bot filtering on collector

## 📦 No Build Required

Just copy-paste the script tag. Works with any website:
- Plain HTML/JS
- WordPress
- Shopify
- React, Vue, Angular
- Any CMS or framework

## 🔗 Links

- [Collector Repository](https://github.com/YOUR-USERNAME/analytics-monorepo)
- [Documentation](https://YOUR-USERNAME.github.io/analytics-sdk-cdn/)

## 📝 License

MIT
