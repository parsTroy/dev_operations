import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      name: string;
      email: string;
      subject: string;
      message: string;
    };

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create transporter using Namecheap Private Email SMTP
    const transporter = nodemailer.createTransport({
      host: 'mail.privateemail.com', // Namecheap's SMTP server
      port: 587, // Standard port for TLS
      secure: false, // false for 587, true for 465
      auth: {
        user: process.env.SMTP_USER, // support@devoperations.ca
        pass: process.env.SMTP_PASS, // Your email password
      },
      tls: {
        rejectUnauthorized: false // Sometimes needed for private email
      }
    });

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER, // support@devoperations.ca
      to: 'support@devoperations.ca', // Where to send the contact form
      subject: `Contact Form: ${body.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${body.name}</p>
            <p><strong>Email:</strong> ${body.email}</p>
            <p><strong>Subject:</strong> ${body.subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
              ${body.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            This message was sent from the dev_operations contact form.
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { 
        success: true, 
        message: "Email sent successfully"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}
