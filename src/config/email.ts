import nodemailer, { Transporter } from "nodemailer";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: Transporter;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !port || !user || !pass) {
      throw new Error(
        "Email configuration is incomplete. Check environment variables.",
      );
    }

    const config: EmailConfig = {
      host,
      port: parseInt(port, 10),
      secure: parseInt(port, 10) === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    };

    this.transporter = nodemailer.createTransport(config);
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p style="font-size: 16px; color: #555;">Your OTP code is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; border-radius: 5px;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #888; margin-top: 20px;">This code will expire in 5 minutes.</p>
          <p style="font-size: 14px; color: #888;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`OTP sent successfully to ${email}`);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send OTP email");
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log("Email service is ready");
      return true;
    } catch (error) {
      console.error("Email service verification failed:", error);
      return false;
    }
  }
}

export default new EmailService();
