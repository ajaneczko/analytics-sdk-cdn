/**
 * Auto-Track Everything - Analytics SDK Extension
 * Automatically tracks all user interactions, clicks, forms, and page views
 * 
 * Usage:
 * <script src="analytics.min.js"></script>
 * <script src="auto-track.js"></script>
 * <script>
 *   Analytics.init({ endpoint: '...', siteId: '...' });
 *   AutoTrack.start();
 * </script>
 */

(function(window) {
  'use strict';

  const AutoTrack = {
    config: {
      trackClicks: true,
      trackForms: true,
      trackScroll: true,
      trackErrors: true,
      trackPerformance: true,
      trackVisibility: true,
      captureText: true,        // Capture button/link text
      captureAttributes: true,  // Capture data-* attributes
      debounceScroll: 500,      // Debounce scroll events
    },

    /**
     * Start auto-tracking
     */
    start(customConfig = {}) {
      this.config = { ...this.config, ...customConfig };
      
      // Wait for Analytics SDK to be ready
      if (!window.Analytics || !window.Analytics.instance) {
        console.log('[AutoTrack] Waiting for Analytics SDK to initialize...');
        
        // Retry every 50ms for up to 5 seconds
        let attempts = 0;
        const maxAttempts = 100; // 100 * 50ms = 5 seconds
        
        const checkInterval = setInterval(() => {
          attempts++;
          
          if (window.Analytics && window.Analytics.instance) {
            clearInterval(checkInterval);
            console.log('[AutoTrack] ✅ Analytics SDK ready, starting auto-tracking');
            this._initializeTracking();
          } else if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            console.error('[AutoTrack] ❌ Analytics SDK not initialized after 5 seconds. Call Analytics.init() first.');
          }
        }, 50);
        
        return;
      }

      this._initializeTracking();
    },

    /**
     * Initialize all tracking listeners
     */
    _initializeTracking() {
      console.log('[AutoTrack] Starting automatic event tracking...');
      
      // Track page performance
      if (this.config.trackPerformance) {
        this.trackPerformance();
      }

      // Track all clicks
      if (this.config.trackClicks) {
        this.trackClicks();
      }

      // Track all form submissions
      if (this.config.trackForms) {
        this.trackForms();
      }

      // Track scroll depth
      if (this.config.trackScroll) {
        this.trackScroll();
      }

      // Track JavaScript errors
      if (this.config.trackErrors) {
        this.trackErrors();
      }

      // Track visibility changes
      if (this.config.trackVisibility) {
        this.trackVisibility();
      }

      // Track input focus
      this.trackInputFocus();

      console.log('[AutoTrack] ✅ Auto-tracking enabled');
    },

    /**
     * Track all clicks with element details
     */
    trackClicks() {
      document.addEventListener('click', (e) => {
        try {
          const element = e.target;
          const props = this.getElementProps(element);
          
          // Determine element type
          let eventName = 'element_clicked';
          const tagName = element.tagName.toLowerCase();
          
          if (tagName === 'button') {
            eventName = 'button_clicked';
          } else if (tagName === 'a') {
            eventName = 'link_clicked';
            props.href = element.href;
            props.target = element.target;
          } else if (element.hasAttribute('role') && element.getAttribute('role') === 'button') {
            eventName = 'button_clicked';
          }

          window.Analytics.track(eventName, props);
        } catch (err) {
          console.error('[AutoTrack] Error tracking click:', err, e.target);
        }
      }, true);
    },

    /**
     * Track all form submissions
     */
    trackForms() {
      document.addEventListener('submit', (e) => {
        const form = e.target;
        const props = {
          formId: form.id || 'unknown',
          formName: form.name || 'unknown',
          formAction: form.action,
          formMethod: form.method,
          fieldCount: form.elements.length,
          fields: []
        };

        // Capture form field names (not values for privacy)
        for (let i = 0; i < form.elements.length; i++) {
          const field = form.elements[i];
          if (field.name && field.type !== 'password') {
            props.fields.push({
              name: field.name,
              type: field.type
            });
          }
        }

        window.Analytics.track('form_submitted', props);
      }, true);
    },

    /**
     * Track scroll depth
     */
    trackScroll() {
      let maxScroll = 0;
      let scrollTimer;
      const milestones = [25, 50, 75, 90, 100];
      const tracked = new Set();

      const trackScrollDepth = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);

        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent;

          // Track milestones
          milestones.forEach(milestone => {
            if (scrollPercent >= milestone && !tracked.has(milestone)) {
              tracked.add(milestone);
              window.Analytics.track('scroll_depth', {
                depth: milestone
              });
            }
          });
        }
      };

      window.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(trackScrollDepth, this.config.debounceScroll);
      });
    },

    /**
     * Track JavaScript errors
     */
    trackErrors() {
      window.addEventListener('error', (e) => {
        window.Analytics.track('javascript_error', {
          message: e.message,
          filename: e.filename,
          line: e.lineno,
          column: e.colno,
          stack: e.error?.stack?.substring(0, 500) // Limit stack trace
        });
      });

      window.addEventListener('unhandledrejection', (e) => {
        window.Analytics.track('promise_rejection', {
          reason: String(e.reason)
        });
      });
    },

    /**
     * Track page visibility changes
     */
    trackVisibility() {
      let startTime = Date.now();

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          const timeOnPage = Math.round((Date.now() - startTime) / 1000);
          window.Analytics.track('page_hidden', {
            timeOnPage: timeOnPage
          });
        } else {
          startTime = Date.now();
          window.Analytics.track('page_visible', {});
        }
      });
    },

    /**
     * Track input focus (form field interactions)
     */
    trackInputFocus() {
      const trackedFields = new Set();

      document.addEventListener('focus', (e) => {
        const element = e.target;
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)) {
          const fieldId = element.id || element.name || 'unknown';
          
          if (!trackedFields.has(fieldId)) {
            trackedFields.add(fieldId);
            window.Analytics.track('form_field_focused', {
              fieldId: fieldId,
              fieldName: element.name,
              fieldType: element.type,
              formId: element.form?.id || 'unknown'
            });
          }
        }
      }, true);
    },

    /**
     * Track page performance metrics
     */
    trackPerformance() {
      if (!window.performance || !window.performance.timing) {
        return;
      }

      window.addEventListener('load', () => {
        setTimeout(() => {
          const timing = window.performance.timing;
          const loadTime = timing.loadEventEnd - timing.navigationStart;
          const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
          const firstPaint = performance.getEntriesByType('paint')
            .find(entry => entry.name === 'first-contentful-paint')?.startTime;

          window.Analytics.track('page_performance', {
            loadTime: Math.round(loadTime),
            domReady: Math.round(domReady),
            firstPaint: firstPaint ? Math.round(firstPaint) : undefined
          });
        }, 0);
      });
    },

    /**
     * Extract element properties for tracking
     */
    getElementProps(element) {
      const props = {
        elementType: element.tagName.toLowerCase(),
        page: window.location.pathname
      };

      // ID
      if (element.id) {
        props.elementId = element.id;
      }

      // Classes
      if (element.className && typeof element.className === 'string') {
        props.elementClasses = element.className.split(' ').filter(c => c).join(' ');
      }

      // Text content (limited to 100 chars)
      if (this.config.captureText && element.textContent) {
        props.elementText = element.textContent.trim().substring(0, 100);
      }

      // Special handling for data-ga-id (Google Analytics style tracking ID)
      // Bubble up to find data-ga-id on parent elements (for nested structures)
      let gaIdElement = element;
      let maxDepth = 5; // Check up to 5 parent levels
      while (gaIdElement && maxDepth > 0) {
        if (gaIdElement.dataset && gaIdElement.dataset.gaId) {
          props.gaId = gaIdElement.dataset.gaId;
          break;
        }
        gaIdElement = gaIdElement.parentElement;
        maxDepth--;
      }

      // Data attributes (all data-* attributes)
      if (this.config.captureAttributes && element.dataset) {
        Object.keys(element.dataset).forEach(key => {
          props[`data_${key}`] = element.dataset[key];
        });
      }

      // Special attributes
      if (element.name) props.elementName = element.name;
      if (element.type) props.inputType = element.type; // Don't overwrite elementType!
      if (element.value && element.type !== 'password') {
        props.elementValue = String(element.value).substring(0, 50);
      }

      // Position in DOM
      props.xpath = this.getXPath(element);

      return props;
    },

    /**
     * Get XPath for element
     */
    getXPath(element) {
      if (element.id) {
        return `//*[@id="${element.id}"]`;
      }
      
      if (element === document.body) {
        return '/html/body';
      }

      let ix = 0;
      const siblings = element.parentNode?.childNodes || [];
      
      for (let i = 0; i < siblings.length; i++) {
        const sibling = siblings[i];
        if (sibling === element) {
          const parentPath = element.parentNode ? this.getXPath(element.parentNode) : '';
          return `${parentPath}/${element.tagName.toLowerCase()}[${ix + 1}]`;
        }
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
          ix++;
        }
      }
      
      return '';
    }
  };

  // Global API
  window.AutoTrack = AutoTrack;

})(window);

