# 🎯 Auto-Track Everything Guide

Automatically track **EVERY** user interaction, click, form, and event on your website.

## 🚀 Quick Setup (2 Lines of Code!)

```html
<script src="https://ajaneczko.github.io/analytics-sdk-cdn/analytics.min.js"></script>
<script src="https://ajaneczko.github.io/analytics-sdk-cdn/auto-track.js"></script>
<script>
  Analytics.init({
    endpoint: 'https://your-collector.com',
    siteId: 'your-site'
  });
  
  // Start auto-tracking EVERYTHING!
  AutoTrack.start();
</script>
```

**That's it!** Now tracking:
- ✅ Every click (buttons, links, any element)
- ✅ Every form submission
- ✅ Scroll depth (25%, 50%, 75%, 100%)
- ✅ Page visibility (when user leaves/returns)
- ✅ JavaScript errors
- ✅ Page performance metrics
- ✅ Form field interactions
- ✅ All element IDs, classes, text

---

## 📊 What Gets Tracked Automatically

### 1. Button Clicks
```javascript
{
  event: "button_clicked",
  elementId: "hero-cta",
  elementClasses: "btn btn-primary",
  elementText: "Get Started",
  elementName: "signup-button",
  data_action: "signup",  // from data-action attribute
  page: "/dashboard",
  xpath: "//*[@id='hero-cta']"
}
```

### 2. Link Clicks
```javascript
{
  event: "link_clicked",
  elementId: "nav-reports",
  elementText: "Reports Centre",
  href: "/reports",
  target: "_self",
  page: "/dashboard"
}
```

### 3. Form Submissions
```javascript
{
  event: "form_submitted",
  formId: "contact-form",
  formName: "contact",
  formAction: "/api/contact",
  formMethod: "post",
  fieldCount: 5,
  fields: [
    { name: "email", type: "email" },
    { name: "message", type: "textarea" }
  ]
}
```

### 4. Form Field Focus
```javascript
{
  event: "form_field_focused",
  fieldId: "email-input",
  fieldName: "email",
  fieldType: "email",
  formId: "signup-form",
  page: "/signup"
}
```

### 5. Scroll Depth
```javascript
{
  event: "scroll_depth",
  depth: 50,  // 25, 50, 75, 90, or 100
  page: "/blog/article"
}
```

### 6. JavaScript Errors
```javascript
{
  event: "javascript_error",
  message: "Cannot read property 'x' of undefined",
  filename: "app.js",
  line: 42,
  column: 10,
  stack: "Error: ...",
  page: "/dashboard"
}
```

### 7. Page Performance
```javascript
{
  event: "page_performance",
  loadTime: 1245,      // milliseconds
  domReady: 892,       // milliseconds
  firstPaint: 456,     // milliseconds
  page: "/dashboard"
}
```

### 8. Page Visibility
```javascript
{
  event: "page_hidden",
  timeOnPage: 125,  // seconds
  page: "/reports"
}
```

---

## ⚙️ Configuration Options

```javascript
AutoTrack.start({
  trackClicks: true,          // Track all clicks
  trackForms: true,           // Track form submissions
  trackScroll: true,          // Track scroll depth
  trackErrors: true,          // Track JavaScript errors
  trackPerformance: true,     // Track page load metrics
  trackVisibility: true,      // Track when user leaves/returns
  captureText: true,          // Capture button/link text
  captureAttributes: true,    // Capture data-* attributes
  debounceScroll: 500        // Scroll event debounce (ms)
});
```

---

## 🎨 For Next.js/Vercel (Your Dashboard)

### Setup in `_document.tsx` or `layout.tsx`:

```tsx
// pages/_document.tsx (Pages Router)
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <script src="https://ajaneczko.github.io/analytics-sdk-cdn/analytics.min.js" async />
        <script src="https://ajaneczko.github.io/analytics-sdk-cdn/auto-track.js" async />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('load', function() {
              Analytics.init({
                endpoint: '${process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT}',
                siteId: 'abax-prototype',
                debug: ${process.env.NODE_ENV === 'development'}
              });
              
              // Auto-track EVERYTHING!
              AutoTrack.start();
              
              console.log('📊 Auto-tracking enabled for all events');
            });
          `
        }} />
      </body>
    </Html>
  );
}
```

Or with Next.js Script component:

```tsx
// app/layout.tsx (App Router)
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        
        <Script 
          src="https://ajaneczko.github.io/analytics-sdk-cdn/analytics.min.js"
          strategy="afterInteractive"
        />
        <Script 
          src="https://ajaneczko.github.io/analytics-sdk-cdn/auto-track.js"
          strategy="afterInteractive"
        />
        <Script id="analytics-init" strategy="afterInteractive">
          {`
            Analytics.init({
              endpoint: '${process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT}',
              siteId: 'abax-prototype',
              debug: false
            });
            
            AutoTrack.start({
              captureText: true,
              captureAttributes: true
            });
          `}
        </Script>
      </body>
    </html>
  );
}
```

---

## 🏷️ Add Custom Data Attributes

Make tracking more meaningful with data attributes:

```html
<!-- Your dashboard components -->
<button 
  id="export-report-btn"
  data-section="reports"
  data-action="export"
  data-format="pdf"
  data-report-type="triplog"
>
  Export Triplog
</button>

<!-- When clicked, automatically tracks: -->
{
  event: "button_clicked",
  elementId: "export-report-btn",
  elementText: "Export Triplog",
  data_section: "reports",      // ← automatically captured
  data_action: "export",         // ← automatically captured
  data_format: "pdf",            // ← automatically captured
  data_report_type: "triplog",   // ← automatically captured
  page: "/reports"
}
```

---

## 🎯 Real Examples for Your Dashboard

### Dashboard Navigation
```html
<nav>
  <a href="/dashboard" data-nav="home">Dashboard</a>
  <a href="/triplog" data-nav="triplog">Triplog</a>
  <a href="/map" data-nav="map">Map</a>
  <a href="/equipment" data-nav="equipment">Equipment Control</a>
</nav>

<!-- Automatically tracks with nav identifier! -->
```

### Report Actions
```html
<button 
  id="generate-report"
  data-report-type="driving-behaviour"
  data-date-range="30days"
  data-vehicle-id="abc123"
>
  Generate Report
</button>

<!-- Captures all data-* attributes automatically -->
```

### Map Interactions
```html
<div 
  id="map-marker-123"
  class="map-marker"
  data-vehicle-id="123"
  data-location="Oslo"
  data-status="active"
  onclick="showDetails()"
>
  <!-- Marker -->
</div>

<!-- Click tracked with all context -->
```

---

## 👤 User Identification

Combine auto-tracking with user identification:

```javascript
// When user logs in
Analytics.setUserId(user.id);
Analytics.setUserProps({
  email: user.email,
  role: 'fleet_manager',
  company: 'ABAX',
  plan: 'premium'
});

// Now ALL auto-tracked events include user context!
```

---

## 📈 MongoDB Queries for Analysis

### Most Clicked Elements
```javascript
db.events_raw.aggregate([
  { $match: { "meta.event_type": "event", "meta.event_name": "button_clicked" } },
  { $group: { 
    _id: "$props.elementId", 
    clicks: { $sum: 1 },
    text: { $first: "$props.elementText" }
  }},
  { $sort: { clicks: -1 } },
  { $limit: 10 }
])
```

### Form Completion Rates
```javascript
db.events_raw.aggregate([
  { $match: { 
    "meta.event_name": { $in: ["form_field_focused", "form_submitted"] }
  }},
  { $group: {
    _id: "$props.formId",
    focused: { $sum: { $cond: [{ $eq: ["$meta.event_name", "form_field_focused"] }, 1, 0] }},
    submitted: { $sum: { $cond: [{ $eq: ["$meta.event_name", "form_submitted"] }, 1, 0] }}
  }},
  { $project: {
    formId: "$_id",
    completionRate: { $multiply: [{ $divide: ["$submitted", "$focused"] }, 100] }
  }}
])
```

### Scroll Depth by Page
```javascript
db.events_raw.aggregate([
  { $match: { "meta.event_name": "scroll_depth" } },
  { $group: {
    _id: "$props.page",
    avgDepth: { $avg: "$props.depth" },
    maxDepth: { $max: "$props.depth" }
  }},
  { $sort: { avgDepth: -1 } }
])
```

---

## 🛠️ Debugging

Enable debug mode to see all tracked events:

```javascript
Analytics.init({
  endpoint: 'http://localhost:8080',
  siteId: 'test',
  debug: true  // Shows all events in console
});

AutoTrack.start();

// Console will show:
// [Analytics] button_clicked
// [Analytics] scroll_depth
// [Analytics] form_field_focused
// etc.
```

---

## ⚡ Performance

Auto-tracking is highly optimized:
- **Scroll events**: Debounced (500ms default)
- **Memory efficient**: No memory leaks
- **Minimal overhead**: ~2KB gzipped
- **Non-blocking**: Doesn't affect page performance

---

## 🎉 Complete Setup Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>ABAX Dashboard</title>
</head>
<body>
  <!-- Your app content -->
  <div id="app">
    <button id="export-btn" data-action="export">Export</button>
  </div>

  <!-- Load Analytics SDK -->
  <script src="https://ajaneczko.github.io/analytics-sdk-cdn/analytics.min.js"></script>
  <script src="https://ajaneczko.github.io/analytics-sdk-cdn/auto-track.js"></script>
  
  <!-- Initialize -->
  <script>
    Analytics.init({
      endpoint: 'https://your-collector.com',
      siteId: 'abax-prototype',
      debug: true
    });
    
    // Auto-track EVERYTHING
    AutoTrack.start();
    
    // Identify user (when they log in)
    Analytics.setUserId('user-123');
    Analytics.setUserProps({ role: 'admin' });
    
    console.log('📊 Tracking enabled!');
  </script>
</body>
</html>
```

**That's it!** Every interaction is now tracked automatically! 🎉

---

## 📝 What You Get

After deploying this to your Vercel app:

1. **Every click** on buttons, links, elements → tracked with ID, class, text
2. **Every form** submission → tracked with field names and structure
3. **Every scroll** milestone → tracked at 25%, 50%, 75%, 100%
4. **Every error** → tracked with stack trace
5. **Every page** view → tracked with performance metrics
6. **All user context** → combined with user ID and properties

All data flows to your MongoDB `events_raw` collection for analysis! 🚀


