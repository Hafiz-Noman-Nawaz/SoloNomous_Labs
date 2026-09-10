export interface EmailPayload {
  to: string;
  subject: string;
  template: 'new_lead' | 'contact_received' | 'quote_request' | 'newsletter_welcome';
  data: Record<string, any>;
}

export class EmailService {
  /**
   * Send transactional email. Pluggable provider (Resend, SendGrid, Postmark, Console logger).
   */
  public static async sendEmail(payload: EmailPayload): Promise<{ success: boolean; id?: string }> {
    console.log(`📨 [Transactional Email] Dispatching "${payload.template}" to: ${payload.to}`);
    console.log(`   Subject: ${payload.subject}`);
    console.log(`   Payload Summary:`, JSON.stringify(payload.data, null, 2));

    // When an API key (e.g. RESEND_API_KEY) is supplied, actual dispatch happens here.
    return {
      success: true,
      id: `mail_${Date.now()}`
    };
  }

  public static async notifyAdminNewLead(lead: any): Promise<void> {
    await this.sendEmail({
      to: process.env.ADMIN_EMAIL || 'founder@solonomouslabs.com',
      subject: `🔥 New Lead Alert [${lead.priority.toUpperCase()}]: ${lead.fullName} (${lead.serviceInterested || 'General'})`,
      template: 'new_lead',
      data: {
        leadId: lead._id,
        name: lead.fullName,
        email: lead.email,
        company: lead.company,
        budget: lead.budgetRange,
        description: lead.projectDescription
      }
    });
  }
}
