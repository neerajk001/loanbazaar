// Email notification utility
// For production, integrate with Resend, SendGrid, or AWS SES

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(template: EmailTemplate): Promise<boolean> {
  // TODO: Integrate with actual email service
  // For now, just log the email that would be sent
  
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 Email would be sent:');
    console.log('To:', template.to);
    console.log('Subject:', template.subject);
    console.log('Body:', template.text || template.html);
    return true;
  }
  
  // Production implementation would go here
  // Example with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'noreply@loansarathi.com',
  //   to: template.to,
  //   subject: template.subject,
  //   html: template.html,
  // });
  
  return true;
}

export function createLoanApplicationConfirmationEmail(
  name: string,
  applicationId: string,
  email: string,
  loanType: string,
  loanAmount: number
): EmailTemplate {
  const subject = `Application Received - ${applicationId}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .reference-box { background: white; border: 2px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .reference-id { font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 2px; }
        .info-table { width: 100%; margin: 20px 0; }
        .info-table td { padding: 10px; border-bottom: 1px solid #ddd; }
        .info-table td:first-child { font-weight: bold; width: 40%; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Application Received!</h1>
          <p>Thank you for choosing Loanbazaar</p>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          
          <p>We have successfully received your ${loanType} loan application. Our team will review it shortly.</p>
          
          <div class="reference-box">
            <p style="margin: 0 0 10px 0; color: #666;">Your Reference ID</p>
            <div class="reference-id">${applicationId}</div>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">Please save this ID for tracking your application</p>
          </div>
          
          <h3>Application Details</h3>
          <table class="info-table">
            <tr>
              <td>Loan Type</td>
              <td>${loanType.charAt(0).toUpperCase() + loanType.slice(1)} Loan</td>
            </tr>
            <tr>
              <td>Loan Amount</td>
              <td>₹${loanAmount.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>Application Date</td>
              <td>${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td><strong style="color: #f59e0b;">Pending Review</strong></td>
            </tr>
          </table>
          
          <h3>What happens next?</h3>
          <ol>
            <li>Our team will verify your application details within 24-48 hours</li>
            <li>We may contact you for additional documents if required</li>
            <li>Once verified, we'll connect you with our lending partners</li>
          </ol>
          
          <div class="footer">
            <p>Need help? Contact us at <a href="mailto:support@loansarathi.com">support@loansarathi.com</a></p>
            <p>© ${new Date().getFullYear()} Loanbazaar. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Dear ${name},

Thank you for submitting your ${loanType} loan application!

Your Reference ID: ${applicationId}

Application Details:
- Loan Type: ${loanType.charAt(0).toUpperCase() + loanType.slice(1)} Loan
- Loan Amount: ₹${loanAmount.toLocaleString('en-IN')}
- Application Date: ${new Date().toLocaleDateString('en-IN')}
- Status: Pending Review

What happens next?
1. Our team will verify your application details within 24-48 hours
2. We may contact you for additional documents if required
3. Once verified, we'll connect you with our lending partners

Need help? Contact us at support@loansarathi.com

© ${new Date().getFullYear()} Loanbazaar
  `;
  
  return {
    to: email,
    subject,
    html,
    text
  };
}

export function createInsuranceApplicationConfirmationEmail(
  name: string,
  applicationId: string,
  email: string,
  insuranceType: string
): EmailTemplate {
  const subject = `Insurance Quote Request Received - ${applicationId}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .reference-box { background: white; border: 2px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .reference-id { font-size: 24px; font-weight: bold; color: #10b981; letter-spacing: 2px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛡️ Quote Request Received!</h1>
          <p>Thank you for choosing Loanbazaar Insurance</p>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          
          <p>We have received your ${insuranceType} insurance quote request. We'll get back to you with the best quotes shortly!</p>
          
          <div class="reference-box">
            <p style="margin: 0 0 10px 0; color: #666;">Your Reference ID</p>
            <div class="reference-id">${applicationId}</div>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">Use this ID to track your quote request</p>
          </div>
          
          <h3>What happens next?</h3>
          <ol>
            <li>Our insurance experts will review your requirements</li>
            <li>We'll send you personalized quotes from top insurers within 24 hours</li>
            <li>Compare and choose the best plan for your needs</li>
            <li>Complete your purchase online or speak with our advisors</li>
          </ol>
          
          <div class="footer">
            <p>Questions? Contact us at <a href="mailto:insurance@loansarathi.com">insurance@loansarathi.com</a></p>
            <p>© ${new Date().getFullYear()} Loanbazaar. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Dear ${name},

We have received your ${insuranceType} insurance quote request!

Your Reference ID: ${applicationId}

What happens next?
1. Our insurance experts will review your requirements
2. We'll send you personalized quotes from top insurers within 24 hours
3. Compare and choose the best plan for your needs
4. Complete your purchase online or speak with our advisors

Questions? Contact us at insurance@loansarathi.com

© ${new Date().getFullYear()} Loanbazaar
  `;
  
  return {
    to: email,
    subject,
    html,
    text
  };
}

export function createStatusUpdateEmail(
  name: string,
  applicationId: string,
  email: string,
  oldStatus: string,
  newStatus: string,
  notes?: string
): EmailTemplate {
  const statusColors: Record<string, string> = {
    pending: '#f59e0b',
    reviewing: '#3b82f6',
    verified: '#8b5cf6',
    approved: '#10b981',
    rejected: '#ef4444',
  };
  
  const subject = `Application Status Update - ${applicationId}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2>Application Status Updated</h2>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
          <p>Dear ${name},</p>
          <p>Your application <strong>${applicationId}</strong> has been updated.</p>
          
          <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid ${statusColors[newStatus] || '#667eea'};">
            <p style="margin: 0 0 10px 0;"><strong>New Status:</strong></p>
            <p style="font-size: 20px; font-weight: bold; color: ${statusColors[newStatus] || '#667eea'}; margin: 0;">${newStatus.toUpperCase()}</p>
          </div>
          
          ${notes ? `<p><strong>Additional Notes:</strong><br>${notes}</p>` : ''}
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Dear ${name},

Your application ${applicationId} has been updated.

New Status: ${newStatus.toUpperCase()}

${notes ? `Notes: ${notes}` : ''}

© ${new Date().getFullYear()} Loanbazaar
  `;
  
  return {
    to: email,
    subject,
    html,
    text
  };
}

export function createAdminNotificationEmail(
  adminEmail: string,
  applicationId: string,
  applicantName: string,
  type: 'loan' | 'insurance'
): EmailTemplate {
  const subject = `New ${type === 'loan' ? 'Loan' : 'Insurance'} Application - ${applicationId}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>🔔 New Application Received</h2>
        <p><strong>Application ID:</strong> ${applicationId}</p>
        <p><strong>Applicant:</strong> ${applicantName}</p>
        <p><strong>Type:</strong> ${type === 'loan' ? 'Loan Application' : 'Insurance Quote Request'}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN')}</p>
        
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/applications" style="display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">View in Admin Panel</a>
      </div>
    </body>
    </html>
  `;
  
  const text = `
New Application Received

Application ID: ${applicationId}
Applicant: ${applicantName}
Type: ${type === 'loan' ? 'Loan Application' : 'Insurance Quote Request'}
Time: ${new Date().toLocaleString('en-IN')}

View in Admin Panel: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/applications
  `;
  
  return {
    to: adminEmail,
    subject,
    html,
    text
  };
}
