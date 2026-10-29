import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserModel } from '../models/User';
import { ApiError } from '../utils/http';

interface TokenPayload extends jwt.JwtPayload {
  sub: string;
  role: 'customer' | 'admin';
}

function readToken(req: Request): string | null {
  const cookieToken = req.cookies?.[env.COOKIE_NAME];
  if (typeof cookieToken === 'string' && cookieToken.length > 0) return cookieToken;

  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7).trim();
  return null;
}

async function resolveUser(req: Request): Promise<Express.AuthUser | null> {
  const token = readToken(req);
  if (!token) return null;

  let payload: TokenPayload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }

  if (!payload.sub) return null;

  const user = await UserModel.findById(payload.sub).select('name email role').lean();
  if (!user) return null;

  return {
    id: String(user._id),
    email: user.email,
    name: user.name,
    role: user.role as 'customer' | 'admin'
  };
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    req.user = (await resolveUser(req)) ?? undefined;
    next();
  } catch (error) {
    next(error);
  }
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const user = await resolveUser(req);
    if (!user) throw new ApiError(401, 'Authentication required');
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) return next(new ApiError(401, 'Authentication required'));
  if (req.user.role !== 'admin') return next(new ApiError(403, 'Admin access required'));
  next();
}
