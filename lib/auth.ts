import jwt from 'jsonwebtoken';
import { JWTPayload } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'swachhai-dev-secret-change-in-prod';
const JWT_EXPIRES = '7d';

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}
