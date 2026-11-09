import { NextResponse } from "next/server";
import { verifyPassword } from "../../../../../database/password";
import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS
} from "@/lib/auth-session";

export const runtime = "nodejs";

type LoginPayload = {
  email?: string;
  password?: string;
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/"
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as LoginPayload | null;
  const email = payload?.email?.trim().toLowerCase();
  const password = payload?.password;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      email: true,
      name: true,
      role: true,
      passwordHash: true
    }
  });

  if (
    !user ||
    user.role !== "ADMIN" ||
    !user.passwordHash ||
    !verifyPassword(password, user.passwordHash)
  ) {
    return NextResponse.json(
      { error: "Invalid administrator credentials." },
      { status: 401 }
    );
  }

  const token = createSessionToken({
    email: user.email,
    name: user.name,
    role: "ADMIN"
  });

  const response = NextResponse.json({
    success: true,
    user: {
      email: user.email,
      name: user.name,
      role: user.role
    }
  });

  response.cookies.set(SESSION_COOKIE, token, {
    ...cookieOptions,
    maxAge: SESSION_TTL_SECONDS
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, "", {
    ...cookieOptions,
    maxAge: 0
  });
  return response;
}
