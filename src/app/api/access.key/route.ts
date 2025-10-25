import { NextResponse } from 'next/server'

const DEFAULT_DAYS_VALID = 30;      // días de validez totales
const DEFAULT_RENEW_BEFORE = 5;     // pedir renovación N días antes de expirar

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export async function GET() {

  const accessLocked = process.env.ACCESS_LOCKED === 'true';

  if (!accessLocked) {
    return NextResponse.json(
      { error: 'Access key issuing is currently locked by administrator.' },
      { status: 403 }
    );
  }

  const issued_at = new Date();
  const expires_at = new Date(issued_at.getTime() + DEFAULT_DAYS_VALID * MS_PER_DAY);
  const renew_at = new Date(expires_at.getTime() - DEFAULT_RENEW_BEFORE * MS_PER_DAY);

  return NextResponse.json({
    issuedAt: issued_at.toISOString(),
    expiresAt: expires_at.toISOString(),
    renewAt: renew_at.toISOString()
  });
}