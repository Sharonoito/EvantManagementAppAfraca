import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const VERIFIED_FROM_EMAIL = "noreply@attendees.pathwaystechnologies.com"

console.log("[v0] Email configuration:", {
  resendApiKey: process.env.RESEND_API_KEY ? "✓ Set" : "✗ Missing",
  fromEmail: VERIFIED_FROM_EMAIL,
})

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  try {
    console.log(`[v0] Attempting to send email to: ${to}`)
    console.log(`[v0] Email subject: ${subject}`)
    console.log(`[v0] From address: ${VERIFIED_FROM_EMAIL}`)

    const result = await resend.emails.send({
      from: VERIFIED_FROM_EMAIL,
      to,
      subject,
      html,
    })

    console.log(`[v0] Email sent successfully to ${to}:`, {
      id: result.data?.id,
      error: result.error,
    })

    if (result.error) {
      console.error(`[v0] Resend API error:`, result.error)
      return false
    }

    return true
  } catch (error) {
    console.error(`[v0] Failed to send email to ${to}:`, error)
    if (error instanceof Error) {
      console.error(`[v0] Error name: ${error.name}`)
      console.error(`[v0] Error message: ${error.message}`)
      console.error(`[v0] Error stack: ${error.stack}`)
    }
    return false
  }
}

export function createQRCodeEmailTemplate(name: string, qrCodeDataUrl: string, checkInURL: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://evant-management-app-afraca.vercel.app"
  const attendeePortalUrl = `${siteUrl}/attendee/profile`

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Congress QR Code</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">8th World Congress</h1>
          <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Rural & Agricultural Finance</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Hello ${name}!</h2>
          
          <p>Welcome to the 8th World Congress on Rural & Agricultural Finance. We're excited to have you join us!</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="margin-top: 0; color: #495057;">Your Check-in QR Code</h3>
            <img src="${qrCodeDataUrl}" alt="QR Code" style="max-width: 200px; height: auto; border: 2px solid #dee2e6; border-radius: 8px;">
            <p style="margin: 15px 0 5px 0; font-size: 14px; color: #6c757d;">Scan this code at registration</p>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1976d2;">📱 Access Your Attendee Portal</h3>
            <p style="margin-bottom: 15px;">After checking in, access your personal dashboard:</p>
            <a href="${attendeePortalUrl}" style="display: inline-block; background: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Open Attendee Portal</a>
          </div>
          
          <div style="border-left: 4px solid #28a745; padding-left: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #28a745;">Next Steps:</h3>
            <ol style="margin: 0; padding-left: 20px;">
              <li>Present this QR code at the registration desk</li>
              <li>Complete your check-in process</li>
              <li>Access your attendee portal using the link above</li>
              <li>Explore sessions and networking opportunities</li>
            </ol>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;"><strong>Important:</strong> You'll need to check in with this QR code before accessing your attendee dashboard and congress features.</p>
          </div>
          
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>Congress Organizing Committee</strong>
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6c757d; font-size: 12px;">
          <p>8th World Congress on Rural & Agricultural Finance</p>
        </div>
      </body>
    </html>
  `
}

export async function sendQRCodeEmail(to: string, name: string, qrCodeDataUrl: string, qrCode: string) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://evant-management-app-afraca.vercel.app"
  const attendeePortalUrl = `${siteUrl}/attendee?email=${encodeURIComponent(to)}`

  const htmlContent = createQRCodeEmailTemplate(name, qrCodeDataUrl, qrCode)

  try {
    const result = await resend.emails.send({
      from: VERIFIED_FROM_EMAIL,
      to,
      subject: "🎫 Your Congress QR Code - Check-in Required",
      html: htmlContent,
    })

    return { success: true, data: { messageId: result.data?.id } }
  } catch (error) {
    console.error("Failed to send email:", error)
    if (error instanceof Error) {
      console.error(`[v] Error name: ${error.name}`)
      console.error(`[v] Error message: ${error.message}`)
      console.error(`[v] Error stack: ${error.stack}`)
    }
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function sendTestEmail(to: string): Promise<boolean> {
  console.log(`[v] Sending test email to: ${to}`)

  const testHtml = `
    <h1>Test Email</h1>
    <p>This is a test email to verify your email configuration is working.</p>
    <p>If you receive this, your email setup is correct!</p>
    <p>Sent at: ${new Date().toISOString()}</p>
  `
  return await sendEmail({
    to,
    subject: "Test Email - Congress App",
    html: testHtml,
  })

}
 