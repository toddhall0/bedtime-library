import { Resend } from "resend";
import type { ReactElement } from "react";

type SendEmailInput = {
  to: string | string[];
  subject: string;
  react?: ReactElement;
  html?: string;
  text?: string;
  replyTo?: string | string[];
};

let cachedClient: Resend | null = null;

function getClient(): Resend {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }
  cachedClient = new Resend(apiKey);
  return cachedClient;
}

function getFrom(): string {
  const from = process.env.EMAIL_FROM;
  if (!from) {
    throw new Error("EMAIL_FROM is not set");
  }
  return from;
}

/**
 * Send a transactional email via Resend.
 *
 * In development, the email is logged to the console instead of being sent.
 * Set NODE_ENV=production (or run on Vercel) to actually deliver.
 */
export async function sendEmail(input: SendEmailInput) {
  const { to, subject, react, html, text, replyTo } = input;

  if (!react && !html && !text) {
    throw new Error("sendEmail requires one of: react, html, text");
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("[email:dev] would send", {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      body: react ? "<react component>" : html ?? text,
    });
    return { id: "dev-noop", skipped: true as const };
  }

  const resend = getClient();
  const payload = {
    from: getFrom(),
    to,
    subject,
    ...(replyTo ? { replyTo } : {}),
    ...(react ? { react } : html ? { html } : { text: text! }),
  } as Parameters<typeof resend.emails.send>[0];

  const { data, error } = await resend.emails.send(payload);
  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
  return { id: data?.id, skipped: false as const };
}
