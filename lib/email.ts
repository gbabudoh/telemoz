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

export function teamInviteEmail(
  agencyName: string,
  role: string,
  acceptUrl: string
): Pick<SendEmailOptions, "subject" | "html"> {
  const roleLabel = role === "manager" ? "Manager" : "Contributor";
  return {
    subject: `You've been invited to join ${agencyName} on Telemoz`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
        <div style="margin-bottom:32px">
          <div style="display:inline-block;background:#0a9396;color:#fff;padding:8px 16px;border-radius:8px;font-weight:700;font-size:15px">Telemoz</div>
        </div>
        <h2 style="font-size:24px;font-weight:800;color:#111827;margin:0 0 12px">You've been invited!</h2>
        <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 8px">
          <strong>${agencyName}</strong> has invited you to join their team on Telemoz as a <strong>${roleLabel}</strong>.
        </p>
        <p style="color:#4b5563;font-size:14px;line-height:1.6;margin:0 0 32px">
          As a ${roleLabel}, you'll have access to ${agencyName}'s workspace — projects, clients, and campaigns — all within their account.
        </p>
        <a href="${acceptUrl}"
           style="display:inline-block;padding:14px 28px;background:#0a9396;color:#fff;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px">
          Accept Invitation
        </a>
        <p style="color:#9ca3af;font-size:13px;margin-top:32px;line-height:1.6">
          This invitation expires in 7 days. If you don't have a Telemoz account yet, you'll be prompted to create one after clicking the link.
        </p>
        <p style="color:#d1d5db;font-size:12px;margin-top:16px">
          If you weren't expecting this invitation, you can safely ignore this email.
        </p>
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

export function verificationEmail(
  name: string,
  verifyUrl: string
): Pick<SendEmailOptions, "subject" | "html"> {
  return {
    subject: "Verify your Telemoz email address",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
        <div style="margin-bottom:32px">
          <div style="display:inline-block;background:#0a9396;color:#fff;padding:8px 16px;border-radius:8px;font-weight:700;font-size:15px">Telemoz</div>
        </div>
        <h2 style="font-size:24px;font-weight:800;color:#111827;margin:0 0 12px">Please verify your email address</h2>
        <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 8px">
          Hi ${name},
        </p>
        <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 32px">
          Thanks for signing up for Telemoz! Please verify your email address by clicking the button below. This link expires in 24 hours.
        </p>
        <a href="${verifyUrl}"
           style="display:inline-block;padding:14px 28px;background:#0a9396;color:#fff;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px">
          Verify Email Address
        </a>
        <p style="color:#9ca3af;font-size:13px;margin-top:32px;line-height:1.6">
          If you didn't create a Telemoz account, you can safely ignore this email.
        </p>
      </div>`,
  };
}
