import { createHmac, timingSafeEqual } from 'crypto';

export const IMPERSONATION_COOKIE = 'xray_impersonation';
export const IMPERSONATION_TTL_MS = 30 * 60 * 1000; // 30 minutes
export const IMPERSONATION_TTL_SECONDS = IMPERSONATION_TTL_MS / 1000;

export interface ImpersonationPayload {
  targetUserId: string;
  operatorId: string;
  startedAt: number; // ms epoch
  expiresAt: number; // ms epoch
  reason: string;
}

function b64urlEncode(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(s: string): Buffer {
  const padLen = (4 - (s.length % 4)) % 4;
  const padded = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(padLen);
  return Buffer.from(padded, 'base64');
}

function secret(): string {
  const s = process.env.IMPERSONATION_SECRET;
  if (!s || s.length < 16) {
    throw new Error('IMPERSONATION_SECRET env var missing or too short (min 16 chars).');
  }
  return s;
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('hex');
}

export function encodeImpersonationCookie(p: ImpersonationPayload): string {
  const json = JSON.stringify(p);
  const body = b64urlEncode(Buffer.from(json, 'utf8'));
  const mac = sign(body);
  return `${body}.${mac}`;
}

export function decodeImpersonationCookie(raw: string | null | undefined): ImpersonationPayload | null {
  if (!raw) return null;
  const idx = raw.indexOf('.');
  if (idx < 0) return null;
  const body = raw.slice(0, idx);
  const mac = raw.slice(idx + 1);
  let expected: string;
  try {
    expected = sign(body);
  } catch {
    return null;
  }
  const macBuf = Buffer.from(mac, 'hex');
  const expBuf = Buffer.from(expected, 'hex');
  if (macBuf.length !== expBuf.length || !timingSafeEqual(macBuf, expBuf)) return null;
  try {
    const json = b64urlDecode(body).toString('utf8');
    const parsed = JSON.parse(json);
    if (
      typeof parsed.targetUserId !== 'string' ||
      typeof parsed.operatorId !== 'string' ||
      typeof parsed.startedAt !== 'number' ||
      typeof parsed.expiresAt !== 'number' ||
      typeof parsed.reason !== 'string'
    ) {
      return null;
    }
    return parsed as ImpersonationPayload;
  } catch {
    return null;
  }
}

export function isExpired(p: ImpersonationPayload, now: number = Date.now()): boolean {
  return p.expiresAt <= now;
}

export function buildPayload(
  operatorId: string,
  targetUserId: string,
  reason: string,
  now: number = Date.now(),
): ImpersonationPayload {
  return {
    operatorId,
    targetUserId,
    reason,
    startedAt: now,
    expiresAt: now + IMPERSONATION_TTL_MS,
  };
}
