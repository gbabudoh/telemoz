import nodemailer, { Transporter, SendMailOptions } from "nodemailer";

let transporter: Transporter;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT ?? "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

const FROM = `"${process.env.SMTP_FROM_NAME ?? "Telemoz"}" <${process.env.SMTP_FROM ?? "noreply@telemoz.com"}>`;

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  attachments?: SendMailOptions["attachments"];
}

export async function sendEmail(opts: SendEmailOptions): Promise<void> {
  const t = getTransporter();
  await t.sendMail({
    from: FROM,
    to: Array.isArray(opts.to) ? opts.to.join(", ") : opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    replyTo: opts.replyTo,
    attachments: opts.attachments,
  });
}

// ── Pre-built templates ──────────────────────────────────────────────────────

export function welcomeEmail(name: string, loginUrl: string): Pick<SendEmailOptions, "subject" | "html"> {
  return {
    subject: "Welcome to Telemoz",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <h2>Welcome, ${name}!</h2>
        <p>Your Telemoz account is ready. Click below to sign in and get started.</p>
        <a href="${loginUrl}"
           style="display:inline-block;padding:12px 24px;background:#0a9396;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
          Sign In
        </a>
        <p style="color:#6b7280;font-size:13px;margin-top:24px">
          If you didn't create this account, you can safely ignore this email.
        </p>
      </div>`,
  };
}

export function projectInviteEmail(
  clientName: string,
  proName: string,
  projectName: string,
  inviteUrl: string
): Pick<SendEmailOptions, "subject" | "html"> {
  return {
    subject: `${proName} invited you to "${projectName}"`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <h2>You've been invited to a project</h2>
        <p>Hi ${clientName}, <strong>${proName}</strong> has added you to <strong>${projectName}</strong> on Telemoz.</p>
        <a href="${inviteUrl}"
           style="display:inline-block;padding:12px 24px;background:#0a9396;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
          View Project
        </a>
      </div>`,
  };
}

export function reportReadyEmail(
  clientName: string,
  projectName: string,
  reportUrl: string
): Pick<SendEmailOptions, "subject" | "html"> {
  return {
    subject: `Your report for "${projectName}" is ready`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <h2>New Report Available</h2>
        <p>Hi ${clientName}, a new report for <strong>${projectName}</strong> has been published.</p>
        <a href="${reportUrl}"
           style="display:inline-block;padding:12px 24px;background:#0a9396;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
          View Report
        </a>
      </div>`,
  };
}

export function passwordResetEmail(
  name: string,
  resetUrl: string
): Pick<SendEmailOptions, "subject" | "html"> {
  return {
    subject: "Reset your Telemoz password",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <h2>Password Reset Request</h2>
        <p>Hi ${name}, click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:12px 24px;background:#0a9396;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
          Reset Password
        </a>
        <p style="color:#6b7280;font-size:13px;margin-top:24px">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>`,
  };
}
