import crypto from 'crypto';

const META_PIXEL_ID = '2449386688923586';
const META_CAPI_TOKEN =
  process.env.META_CAPI_ACCESS_TOKEN ||
  'EAAYEgx3hyF0BSZC4KCIaAfapy8FlbP5CKZAsqWiI1mRhbfKf9pxjrjnegbWuYbokZAausggdCZCFHjuBx79BBf4flzGNpLbZCQnipxdVRILg2g4tLmhXD41mhwYz6ZB0bZAD88XMCULCZBnqcIGglSKSsE7ipl7tLVVKWqZAlW3tROI7q2n76C7ojM7SBwuLxExiK0AZDZD';

function hashValue(value?: string | null): string | undefined {
  if (!value) return undefined;
  const cleaned = value.trim().toLowerCase();
  if (!cleaned) return undefined;
  return crypto.createHash('sha256').update(cleaned).digest('hex');
}

function cleanPhone(phone?: string | null): string | undefined {
  if (!phone) return undefined;
  // Remove non-digit characters
  const digits = phone.replace(/\D/g, '');
  if (!digits) return undefined;
  // Format Pakistani numbers (e.g., 03... -> 923...)
  const formatted = digits.startsWith('0') ? '92' + digits.substring(1) : digits;
  return hashValue(formatted);
}

export interface MetaCapiParams {
  eventName: 'Purchase' | 'InitiateCheckout' | 'Lead' | 'PageView' | 'Contact';
  eventId?: string;
  email?: string;
  phone?: string;
  clientIp?: string;
  userAgent?: string;
  value?: number;
  currency?: string;
  eventSourceUrl?: string;
  testEventCode?: string;
}

/**
 * Sends a server-side event to Meta Conversions API (Graph API v21.0)
 * Completely fire-and-forget; never blocks or throws errors on user requests.
 */
export async function sendMetaCapiEvent(params: MetaCapiParams): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const {
      eventName,
      eventId,
      email,
      phone,
      clientIp,
      userAgent,
      value = 3799,
      currency = 'PKR',
      eventSourceUrl = 'https://ecomwithsami.com/enrollment',
      testEventCode,
    } = params;

    const userData: Record<string, any> = {};

    const hashedEmail = hashValue(email);
    if (hashedEmail) userData.em = [hashedEmail];

    const hashedPhone = cleanPhone(phone);
    if (hashedPhone) userData.ph = [hashedPhone];

    if (clientIp) userData.client_ip_address = clientIp;
    if (userAgent) userData.client_user_agent = userAgent;

    const eventPayload: Record<string, any> = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: eventSourceUrl,
      user_data: userData,
    };

    if (eventId) {
      eventPayload.event_id = eventId;
    }

    if (value !== undefined) {
      eventPayload.custom_data = {
        currency: currency,
        value: Number(value),
        content_name: 'Ecom With Sami Mentorship Program',
        content_type: 'product',
      };
    }

    const requestBody: Record<string, any> = {
      data: [eventPayload],
    };

    if (testEventCode) {
      requestBody.test_event_code = testEventCode;
    }

    const endpoint = `https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events?access_token=${META_CAPI_TOKEN}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      console.warn('[Meta CAPI] Event dispatch warning:', data.error || data);
      return { success: false, error: data.error };
    }

    return { success: true, data };
  } catch (err: any) {
    console.warn('[Meta CAPI] Network error sending event:', err.message || err);
    return { success: false, error: err.message };
  }
}
