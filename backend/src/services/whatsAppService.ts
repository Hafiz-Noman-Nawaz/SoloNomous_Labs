import { SiteSettings } from '../models/SiteSettingsAndMedia';

export interface WhatsAppAlertResult {
  success: boolean;
  recipient: string;
  directUrl: string;
  error?: string;
}

export class WhatsAppService {
  /**
   * Retrieves the configured WhatsApp recipient from CMS SiteSettings or environment fallback
   */
  public static async getRecipientNumber(): Promise<string> {
    try {
      const settings = await SiteSettings.findOne();
      if (settings?.whatsappNumber && settings.whatsappNumber.trim()) {
        return settings.whatsappNumber.trim();
      }
      if (settings?.contactPhone && settings.contactPhone.trim()) {
        return settings.contactPhone.trim();
      }
    } catch (err) {
      console.warn('⚠️ [WhatsApp] Could not fetch recipient from SiteSettings:', err);
    }

    return process.env.ADMIN_WHATSAPP || process.env.WHATSAPP_NUMBER || '+923156251281';
  }

  /**
   * Formats a clean international digits-only phone string for wa.me links
   */
  public static sanitizePhone(phone: string): string {
    return phone.replace(/[^0-9]/g, '');
  }

  /**
   * Generates a direct 1-click wa.me action URL with URL-encoded text
   */
  public static generateDirectUrl(phone: string, text: string): string {
    const cleanPhone = this.sanitizePhone(phone);
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  }

  /**
   * Dispatches WhatsApp alert message to the configured phone number
   */
  public static async sendAlert(text: string, overrideRecipient?: string): Promise<WhatsAppAlertResult> {
    const recipient = overrideRecipient || (await this.getRecipientNumber());
    const directUrl = this.generateDirectUrl(recipient, text);

    console.log('\n======================================================');
    console.log(`📱 [WHATSAPP DISPATCH] Incoming Alert to: ${recipient}`);
    console.log(`🔗 Direct WhatsApp Link: ${directUrl}`);
    console.log('---------------- Message Content ---------------------');
    console.log(text);
    console.log('======================================================\n');

    // 1. Twilio WhatsApp API Gateway (if configured in .env)
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_WHATSAPP_NUMBER; // e.g. "whatsapp:+14155238886"

    if (twilioSid && twilioToken && twilioFrom) {
      try {
        const cleanRecipient = recipient.startsWith('+') ? recipient : `+${recipient.replace(/[^0-9]/g, '')}`;
        const basicAuth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;

        const params = new URLSearchParams();
        params.append('From', twilioFrom.startsWith('whatsapp:') ? twilioFrom : `whatsapp:${twilioFrom}`);
        params.append('To', `whatsapp:${cleanRecipient}`);
        params.append('Body', text);

        const twilioRes = await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        });

        if (twilioRes.ok) {
          console.log(`✅ [WhatsApp] Delivered via Twilio to whatsapp:${cleanRecipient}`);
          return { success: true, recipient, directUrl };
        } else {
          const errText = await twilioRes.text();
          console.warn(`⚠️ [WhatsApp] Twilio dispatch returned ${twilioRes.status}:`, errText);
        }
      } catch (err: any) {
        console.error('❌ [WhatsApp] Twilio dispatch error:', err.message);
      }
    }

    // 2. CallMeBot Free WhatsApp API (if CALLMEBOT_API_KEY is configured in .env)
    const callmebotApiKey = process.env.CALLMEBOT_API_KEY;
    if (callmebotApiKey) {
      try {
        const cleanRecipient = this.sanitizePhone(recipient);
        const cmbUrl = `https://api.callmebot.com/whatsapp.php?phone=${cleanRecipient}&text=${encodeURIComponent(text)}&apikey=${callmebotApiKey}`;
        const cmbRes = await fetch(cmbUrl);
        if (cmbRes.ok) {
          console.log(`✅ [WhatsApp] Delivered via CallMeBot to ${cleanRecipient}`);
          return { success: true, recipient, directUrl };
        }
      } catch (err: any) {
        console.error('❌ [WhatsApp] CallMeBot error:', err.message);
      }
    }

    // 3. Generic WhatsApp Webhook (if WHATSAPP_WEBHOOK_URL is configured in .env)
    const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient,
            message: text,
            directUrl,
            timestamp: new Date().toISOString()
          })
        });
        console.log(`✅ [WhatsApp] Webhook dispatched to ${webhookUrl}`);
      } catch (err: any) {
        console.error('❌ [WhatsApp] Webhook error:', err.message);
      }
    }

    // Return direct link for client-side or admin link
    return {
      success: true,
      recipient,
      directUrl
    };
  }
}
