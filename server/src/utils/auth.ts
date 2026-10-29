import type { Response } from 'express';
import jwt from 'jsonwebtoken';
import { env, isProd } from '../config/env';
import type { UserDoc } from '../models/User';

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function signToken(user: Pick<UserDoc, 'email' | 'role'> & { id: string }): string {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  );
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(env.COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd || env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    maxAge: MAX_AGE_MS,
    path: '/'
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(env.COOKIE_NAME, {
    httpOnly: true,
    secure: isProd || env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: '/'
  });
}
