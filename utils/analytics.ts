// Client-side analytics event tracker for conversions, clicks, and pageviews

export interface AnalyticsEventData {
  contact_channel?: string;
  action?: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

export const analytics = {
  trackContact: (data: AnalyticsEventData) => {
    try {
      if (typeof window !== 'undefined') {
        // Facebook Pixel contact tracking
        if ((window as any).fbq) {
          (window as any).fbq('track', 'Contact', data);
        }
        // TikTok Pixel contact tracking
        if ((window as any).ttq) {
          (window as any).ttq.track('Contact', data);
        }
        // Google Analytics 4 event tracking
        if ((window as any).gtag) {
          (window as any).gtag('event', 'contact', data);
        }
      }
    } catch (err) {
      console.warn('[Analytics] Failed to track contact event:', err);
    }
  },

  trackEvent: (eventName: string, data?: AnalyticsEventData) => {
    try {
      if (typeof window !== 'undefined') {
        if ((window as any).fbq) {
          (window as any).fbq('trackCustom', eventName, data);
        }
        if ((window as any).ttq) {
          (window as any).ttq.track(eventName, data);
        }
        if ((window as any).gtag) {
          (window as any).gtag('event', eventName, data);
        }
      }
    } catch (err) {
      console.warn(`[Analytics] Failed to track ${eventName}:`, err);
    }
  },

  trackInitiateCheckout: (data?: AnalyticsEventData) => {
    try {
      if (typeof window !== 'undefined') {
        if ((window as any).fbq) {
          (window as any).fbq('track', 'InitiateCheckout', data);
        }
        if ((window as any).ttq) {
          (window as any).ttq.track('InitiateCheckout', data);
        }
        if ((window as any).gtag) {
          (window as any).gtag('event', 'begin_checkout', data);
        }
      }
    } catch (err) {
      console.warn('[Analytics] Failed to track InitiateCheckout:', err);
    }
  },

  trackPurchase: (data?: AnalyticsEventData) => {
    try {
      if (typeof window !== 'undefined') {
        const orderId = data?.transaction_id || data?.order_id || `SAMI-${Date.now()}`;
        const val = Number(data?.value) || 3799;
        const cur = data?.currency || 'PKR';
        const contentName = data?.content_name || 'Ecom With Sami Mentorship Program';

        const purchasePayload = {
          value: val,
          currency: cur,
          content_name: contentName,
          content_type: 'product',
          contents: [{ id: 'sami-mentorship-masterclass', quantity: 1, item_price: val }],
          num_items: 1,
          order_id: orderId,
          ...data
        };

        if ((window as any).fbq) {
          (window as any).fbq('track', 'Purchase', purchasePayload, { eventID: orderId });
        }
        if ((window as any).ttq) {
          (window as any).ttq.track('CompletePayment', purchasePayload, { event_id: orderId });
        }
        if ((window as any).gtag) {
          (window as any).gtag('event', 'purchase', {
            transaction_id: orderId,
            value: val,
            currency: cur,
            items: [{ item_name: contentName, price: val, quantity: 1 }]
          });
        }
      }
    } catch (err) {
      console.warn('[Analytics] Failed to track Purchase:', err);
    }
  },

  trackViewContent: (data?: AnalyticsEventData) => {
    try {
      if (typeof window !== 'undefined') {
        if ((window as any).fbq) {
          (window as any).fbq('track', 'ViewContent', data);
        }
        if ((window as any).ttq) {
          (window as any).ttq.track('ViewContent', data);
        }
        if ((window as any).gtag) {
          (window as any).gtag('event', 'view_item', data);
        }
      }
    } catch (err) {
      console.warn('[Analytics] Failed to track ViewContent:', err);
    }
  },

  trackLead: (data?: AnalyticsEventData) => {
    try {
      if (typeof window !== 'undefined') {
        if ((window as any).fbq) {
          (window as any).fbq('track', 'Lead', data);
        }
        if ((window as any).ttq) {
          (window as any).ttq.track('SubmitForm', data);
        }
        if ((window as any).gtag) {
          (window as any).gtag('event', 'generate_lead', data);
        }
      }
    } catch (err) {
      console.warn('[Analytics] Failed to track Lead:', err);
    }
  },

  trackPageView: () => {
    try {
      if (typeof window !== 'undefined') {
        if ((window as any).fbq) {
          (window as any).fbq('track', 'PageView');
        }
      }
    } catch (err) {
      console.warn('[Analytics] Failed to track PageView:', err);
    }
  }
};

export default analytics;
