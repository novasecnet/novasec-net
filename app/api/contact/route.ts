import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Only send if RESEND_API_KEY is configured
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'NovaSec Contact <noreply@novasec.net>',
        to: process.env.CONTACT_EMAIL || 'contact@novasec.net',
        replyTo: email,
        subject: `[NovaSec Contact] ${subject || 'New message from ' + name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#00d4ff;">New Contact Form Submission</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px;font-weight:bold;color:#94a3b8;">Name</td><td style="padding:8px;">${name}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;color:#94a3b8;">Email</td><td style="padding:8px;"><a href="mailto:${email}">${email}</a></td></tr>
              ${subject ? `<tr><td style="padding:8px;font-weight:bold;color:#94a3b8;">Subject</td><td style="padding:8px;">${subject}</td></tr>` : ''}
            </table>
            <div style="margin-top:16px;padding:16px;background:#111827;border-radius:8px;border-left:3px solid #00d4ff;">
              <p style="margin:0;white-space:pre-wrap;">${message}</p>
            </div>
            <p style="margin-top:16px;font-size:12px;color:#94a3b8;">Sent from novasec.net contact form</p>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
