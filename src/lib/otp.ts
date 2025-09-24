export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function sendSMS(phone: string, message: string): Promise<void> {
  // In production, integrate with SMS provider like Twilio
  // For development, log the message
  console.log(`SMS to ${phone}: ${message}`)

  if (process.env.NODE_ENV === 'production' && process.env.TWILIO_ACCOUNT_SID) {
    try {
      // Uncomment and configure for production
      // const twilio = require('twilio')(
      //   process.env.TWILIO_ACCOUNT_SID,
      //   process.env.TWILIO_AUTH_TOKEN
      // )
      //
      // await twilio.messages.create({
      //   body: message,
      //   from: process.env.TWILIO_PHONE_NUMBER,
      //   to: phone
      // })
    } catch (error) {
      console.error('SMS sending failed:', error)
      throw error
    }
  }
}

export async function sendEmail(
  to: string,
  subject: string,
  _text: string,
  _html?: string
): Promise<void> {
  // In production, integrate with email provider
  console.log(`Email to ${to}: ${subject}`)

  if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST) {
    try {
      // Uncomment and configure for production
      // const nodemailer = require('nodemailer')
      //
      // const transporter = nodemailer.createTransporter({
      //   host: process.env.SMTP_HOST,
      //   port: process.env.SMTP_PORT,
      //   secure: false,
      //   auth: {
      //     user: process.env.SMTP_USER,
      //     pass: process.env.SMTP_PASS,
      //   },
      // })
      //
      // await transporter.sendMail({
      //   from: process.env.SMTP_USER,
      //   to,
      //   subject,
      //   text,
      //   html,
      // })
    } catch (error) {
      console.error('Email sending failed:', error)
      throw error
    }
  }
}