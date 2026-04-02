import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingEmailData {
  customerName: string;
  customerPhone: string;
  activityTitle: string;
  bookingDate: string;
  bookingTime?: string | null;
  persons: number;
  price: number;
  bookingId: string;
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not found. Skipping email.');
    return;
  }

  try {
    await resend.emails.send({
      from: 'Taghazout Jet <bookings@taghazoutjet.com>',
      to: 'contact@taghazoutjet.com', // In reality, this would be the customer or admin
      subject: `New Booking: ${data.activityTitle} — ${data.customerName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0B3C6D;">
          <div style="background: #0B3C6D; color: white; padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">TAGHAZOUT JET</h1>
            <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">New Booking Received</p>
          </div>
          <div style="background: #f9f9f9; padding: 40px; border-radius: 0 0 16px 16px; border: 1px solid #eee; border-top: none;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 12px 0; color: #666; font-size: 14px; border-bottom: 1px solid #eee;">Customer</td>
                  <td style="padding: 12px 0; font-weight: bold; color: #0B3C6D; border-bottom: 1px solid #eee; text-align: right;">${data.customerName}</td></tr>
              <tr><td style="padding: 12px 0; color: #666; font-size: 14px; border-bottom: 1px solid #eee;">Phone</td>
                  <td style="padding: 12px 0; font-weight: bold; border-bottom: 1px solid #eee; text-align: right;">${data.customerPhone}</td></tr>
              <tr><td style="padding: 12px 0; color: #666; font-size: 14px; border-bottom: 1px solid #eee;">Activity</td>
                  <td style="padding: 12px 0; font-weight: bold; color: #FF6B35; border-bottom: 1px solid #eee; text-align: right;">${data.activityTitle}</td></tr>
              <tr><td style="padding: 12px 0; color: #666; font-size: 14px; border-bottom: 1px solid #eee;">Date</td>
                  <td style="padding: 12px 0; font-weight: bold; border-bottom: 1px solid #eee; text-align: right;">${data.bookingDate}</td></tr>
              ${data.bookingTime ? `
              <tr><td style="padding: 12px 0; color: #666; font-size: 14px; border-bottom: 1px solid #eee;">Time</td>
                  <td style="padding: 12px 0; font-weight: bold; border-bottom: 1px solid #eee; text-align: right;">${data.bookingTime}</td></tr>` : ''}
              <tr><td style="padding: 12px 0; color: #666; font-size: 14px; border-bottom: 1px solid #eee;">Persons</td>
                  <td style="padding: 12px 0; font-weight: bold; border-bottom: 1px solid #eee; text-align: right;">${data.persons}</td></tr>
              <tr><td style="padding: 20px 0 0; color: #0B3C6D; font-weight: bold; font-size: 16px;">Total Price</td>
                  <td style="padding: 20px 0 0; font-weight: bold; font-size: 24px; color: #FF6B35; text-align: right;">
                    €${(data.price * data.persons).toFixed(2)}
                  </td></tr>
            </table>
            
            <div style="margin-top: 32px; padding: 24px; background: #fff; border-radius: 12px; border: 1px solid #FF6B35; border-left: 6px solid #FF6B35;">
              <p style="margin: 0; font-size: 14px; line-height: 1.6;">
                <strong>Booking ID:</strong> <span style="font-family: monospace;">${data.bookingId.substring(0, 8).toUpperCase()}</span><br/>
                <span style="color: #666; display: block; margin-top: 8px;">Action required: Contact the customer via WhatsApp to confirm the booking.</span>
              </p>
              <div style="margin-top: 20px;">
                <a href="https://wa.me/${data.customerPhone.replace(/\D/g, '')}" 
                   style="background: #25D366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                   Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
          <div style="text-align: center; padding: 24px; color: #999; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Taghazout Jet. All rights reserved.
          </div>
        </div>
      `,
    });
    console.log('Email sent successfully');
  } catch (err) {
    console.error('Error sending email:', err);
  }
}
