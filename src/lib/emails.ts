import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'CortexCanvas <onboarding@resend.dev>', // Replace with your verified domain
      to: [email],
      subject: 'Welcome to CortexCanvas!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a0a0a; color: #ffffff; border-radius: 12px; border: 1px solid #333;">
          <h1 style="color: #00f7ff; text-align: center; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">CortexCanvas</h1>
          <hr style="border: none; border-top: 1px solid #333; margin: 20px 0;" />
          <p style="font-size: 16px; line-height: 1.6; color: #cccccc;">Hello,</p>
          <p style="font-size: 16px; line-height: 1.6; color: #cccccc;">Welcome to <strong>CortexCanvas</strong> – your new AI-powered knowledge workspace. We're thrilled to have you onboard!</p>
          <div style="background-color: #1a1a1a; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #00f7ff;">
            <p style="margin: 0; font-size: 14px; color: #ffffff;">"Our mission is to augment human intelligence through seamless AI collaboration."</p>
          </div>
          <p style="font-size: 16px; line-height: 1.6; color: #cccccc;">You can now start creating documents, collaborating with AI, and organizing your knowledge in a whole new way.</p>
          <div style="text-align: center; margin-top: 35px; margin-bottom: 20px;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background-color: #00f7ff; color: #000000; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; transition: all 0.2s ease;">Get Started Now</a>
          </div>
          <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;" />
          <p style="font-size: 12px; color: #666; text-align: center;">&copy; ${new Date().getFullYear()} CortexCanvas. All rights reserved.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}
