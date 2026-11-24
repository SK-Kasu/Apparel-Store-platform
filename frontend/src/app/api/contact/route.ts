import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactInquiry = {
  reference: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string;
};

const globalForContact = globalThis as unknown as {
  radiantContactInquiries?: ContactInquiry[];
};

function inquiries(): ContactInquiry[] {
  if (!globalForContact.radiantContactInquiries) {
    globalForContact.radiantContactInquiries = [];
  }

  return globalForContact.radiantContactInquiries;
}

function asText(value: unknown, field: string, min: number, max: number): string {
  if (typeof value !== "string") {
    throw new Error(`${field} is required`);
  }

  const text = value.trim();

  if (text.length < min || text.length > max) {
    throw new Error(`${field} must be between ${min} and ${max} characters`);
  }

  return text;
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Invalid contact request" }, { status: 400 });
  }

  const body = payload as Record<string, unknown>;

  try {
    const name = asText(body.name, "Name", 2, 80);
    const email = asText(body.email, "Email", 5, 160);
    const subject = asText(body.subject ?? "General enquiry", "Subject", 2, 120);
    const message = asText(body.message, "Message", 10, 2000);

    if (!EMAIL_PATTERN.test(email)) {
      throw new Error("Enter a valid email address");
    }

    const reference = `MSG-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    const inquiry: ContactInquiry = {
      reference,
      name,
      email,
      subject,
      message,
      receivedAt: new Date().toISOString()
    };

    inquiries().unshift(inquiry);
    if (inquiries().length > 100) {
      inquiries().pop();
    }

    return NextResponse.json(
      {
        ok: true,
        reference,
        message:
          "Asante sana. Your message has reached our Nairobi client care team. We reply within one business day."
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to send your message" },
      { status: 400 }
    );
  }
}
