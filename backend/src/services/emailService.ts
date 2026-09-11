import nodemailer from 'nodemailer';
import { SiteSettings } from '../models/SiteSettingsAndMedia';

export interface EmailPayload {
  to?: string;
  subject: string;
  text: string;
  html?: string;
  template?: string;
  data?: Record<string, any>;
}

export class EmailService {
  /**
   * Retrieves the configured recipient email from CMS SiteSettings or environment fallback
   */
  public static async getRecipientEmail(): Promise<string> {
    try {
      const settings = await SiteSettings.findOne();
      if (settings?.contactEmail && settings.contactEmail.trim()) {
        return settings.contactEmail.trim();
      }
    } catch (err) {
      console.warn('⚠️ [Email] Could not fetch recipient from SiteSettings:', err);
    }

    return process.env.ADMIN_EMAIL || 'nawaznoman7766@gmail.com';
  }

  /**
   * Dispatches an email via configured SMTP (Gmail / Custom SMTP / Resend) or logs to console
   */
  public static async sendEmail(payload: EmailPayload): Promise<{ success: boolean; id?: string }> {
    const recipient = payload.to || (await this.getRecipientEmail());

    console.log('\n======================================================');
    console.log(`📨 [TRANSACTIONAL EMAIL] Dispatching to: ${recipient}`);
    console.log(`   Subject: ${payload.subject}`);
    console.log('---------------- Content Preview ---------------------');
    console.log(payload.text.substring(0, 300) + (payload.text.length > 300 ? '...' : ''));
    console.log('======================================================\n');

    // 1. Resend API Dispatch (if RESEND_API_KEY is configured)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const fromEmail = process.env.RESEND_FROM || 'SoloNomous Labs <onboarding@resend.dev>';
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [recipient],
            subject: payload.subject,
            text: payload.text,
            html: payload.html || payload.text.replace(/\n/g, '<br/>')
          })
        });

        if (resendRes.ok) {
          const resendData = (await resendRes.json()) as any;
          console.log(`✅ [Email] Successfully dispatched via Resend to ${recipient} (ID: ${resendData?.id})`);
          return { success: true, id: resendData?.id };
        } else {
          console.warn(`⚠️ [Email] Resend API responded with status ${resendRes.status}`);
        }
      } catch (err: any) {
        console.error('❌ [Email] Resend dispatch error:', err.message);
      }
    }

    // 2. Nodemailer SMTP / Gmail (if SMTP_HOST or GMAIL_USER is configured)
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '465'),
          secure: process.env.SMTP_SECURE !== 'false',
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        });

        const info = await transporter.sendMail({
          from: `"SoloNomous Labs" <${smtpUser}>`,
          to: recipient,
          subject: payload.subject,
          text: payload.text,
          html: payload.html || payload.text.replace(/\n/g, '<br/>')
        });

        console.log(`✅ [Email] Successfully dispatched via SMTP to ${recipient} (Message ID: ${info.messageId})`);
        return { success: true, id: info.messageId };
      } catch (err: any) {
        console.error('❌ [Email] SMTP dispatch error:', err.message);
      }
    }

    return {
      success: true,
      id: `logged_${Date.now()}`
    };
  }

  /**
   * Sends an alert when a client submits the Contact Form
   */
  public static async sendContactAlert(contact: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    expectedTimeline?: string;
  }): Promise<void> {
    const recipient = await this.getRecipientEmail();
    const timestamp = new Date().toLocaleString();

    const plainText = `
🚨 NEW CLIENT CONTACT MESSAGE RECEIVED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Client Name:        ${contact.name}
Client Email:       ${contact.email}
Phone / WhatsApp:   ${contact.phone || 'Not provided'}
Subject:            ${contact.subject || 'Architectural Inquiry'}
Target Timeline:    ${contact.expectedTimeline || 'Not specified'}
Received At:        ${timestamp}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MESSAGE CONTENT:
${contact.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
View and manage all contact submissions in the SoloNomous Labs CMS.
`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0B0A10; color: #F8FAFC; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background: #12111A; border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 16px; padding: 28px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; background: rgba(139, 92, 246, 0.15); color: #A78BFA; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
    h2 { color: #FFFFFF; font-size: 20px; margin: 0 0 16px 0; }
    .row { display: flex; padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.06); font-size: 13px; }
    .label { width: 140px; color: #94A3B8; font-weight: 600; }
    .val { flex: 1; color: #F1F5F9; }
    .message-box { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 16px; margin-top: 18px; font-size: 14px; line-height: 1.6; color: #E2E8F0; white-space: pre-wrap; }
    .footer { margin-top: 24px; font-size: 11px; color: #64748B; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Incoming Client Message</div>
    <h2>New Inquiry from ${contact.name}</h2>

    <div class="row"><div class="label">Name:</div><div class="val"><strong>${contact.name}</strong></div></div>
    <div class="row"><div class="label">Email:</div><div class="val"><a href="mailto:${contact.email}" style="color: #A78BFA;">${contact.email}</a></div></div>
    <div class="row"><div class="label">Phone / WhatsApp:</div><div class="val">${contact.phone || 'None'}</div></div>
    <div class="row"><div class="label">Subject:</div><div class="val">${contact.subject || 'General Inquiry'}</div></div>
    <div class="row"><div class="label">Timeline:</div><div class="val">${contact.expectedTimeline || 'Flexible'}</div></div>

    <div class="message-box">
      <strong>Client Message:</strong><br/><br/>
      ${contact.message.replace(/\n/g, '<br/>')}
    </div>

    <div class="footer">SoloNomous Labs Automated Notification System</div>
  </div>
</body>
</html>
`;

    await this.sendEmail({
      to: recipient,
      subject: `📨 New Client Inquiry from ${contact.name} (${contact.subject || 'General'})`,
      text: plainText,
      html
    });
  }

  /**
   * Sends an alert when a client selects and orders a service or submits a project brief
   */
  public static async sendServiceOrderAlert(lead: any): Promise<void> {
    const recipient = await this.getRecipientEmail();
    const timestamp = new Date().toLocaleString();
    const serviceName = lead.serviceInterested || lead.projectType || 'Full-Stack Architecture';

    const plainText = `
🚀 NEW SERVICE ORDER / PROJECT BRIEF SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Selected Service:   ${serviceName}
Budget Range:       ${lead.budgetRange || 'Not specified'}
Delivery Timeline:  ${lead.timeline || 'Not specified'}
Project Type:       ${lead.projectType || 'New Build'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Client Name:        ${lead.fullName}
Client Email:       ${lead.email}
Phone:              ${lead.phone || 'Not provided'}
Company / Brand:    ${lead.company || 'Not provided'}
Submitted At:       ${timestamp}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROJECT DESCRIPTION:
${lead.projectDescription || 'No detailed description provided.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Manage this lead in the SoloNomous Labs CMS Command Center.
`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0B0A10; color: #F8FAFC; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background: #12111A; border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 16px; padding: 28px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; background: rgba(16, 185, 129, 0.15); color: #34D399; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
    h2 { color: #FFFFFF; font-size: 20px; margin: 0 0 16px 0; }
    .highlight { background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 12px; padding: 14px; margin-bottom: 18px; }
    .row { display: flex; padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.06); font-size: 13px; }
    .label { width: 140px; color: #94A3B8; font-weight: 600; }
    .val { flex: 1; color: #F1F5F9; }
    .message-box { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 16px; margin-top: 18px; font-size: 14px; line-height: 1.6; color: #E2E8F0; white-space: pre-wrap; }
    .footer { margin-top: 24px; font-size: 11px; color: #64748B; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">🔥 New Service Order</div>
    <h2>${serviceName} Ordered by ${lead.fullName}</h2>

    <div class="highlight">
      <div style="font-size: 12px; color: #A78BFA; font-weight: 600;">SELECTED SERVICE & BUDGET:</div>
      <div style="font-size: 16px; font-weight: 800; color: #FFFFFF; margin-top: 4px;">${serviceName}</div>
      <div style="font-size: 13px; color: #34D399; margin-top: 2px;">Budget: ${lead.budgetRange || 'Pending'} | Timeline: ${lead.timeline || '4-8 Weeks'}</div>
    </div>

    <div class="row"><div class="label">Client Name:</div><div class="val"><strong>${lead.fullName}</strong></div></div>
    <div class="row"><div class="label">Client Email:</div><div class="val"><a href="mailto:${lead.email}" style="color: #A78BFA;">${lead.email}</a></div></div>
    <div class="row"><div class="label">Phone:</div><div class="val">${lead.phone || 'None'}</div></div>
    <div class="row"><div class="label">Company:</div><div class="val">${lead.company || 'Private Founder'}</div></div>

    <div class="message-box">
      <strong>Project Requirements & Scope:</strong><br/><br/>
      ${(lead.projectDescription || 'No description').replace(/\n/g, '<br/>')}
    </div>

    <div class="footer">SoloNomous Labs Automated Notification System</div>
  </div>
</body>
</html>
`;

    await this.sendEmail({
      to: recipient,
      subject: `🚀 [SERVICE ORDER] ${serviceName} requested by ${lead.fullName} (${lead.company || 'New Client'})`,
      text: plainText,
      html
    });
  }

  public static async notifyAdminNewLead(lead: any): Promise<void> {
    await this.sendServiceOrderAlert(lead);
  }
}
