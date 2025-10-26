import { NextResponse } from 'next/server'

const DEFAULT_DAYS_VALID = 30;      // días de validez totales
const DEFAULT_RENEW_BEFORE = 5;     // pedir renovación N días antes de expirar

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export async function GET() {

  const envValue = process.env.ACCESS_ISSUE_ENABLED;

  // Si no está configurada la variable → error explícito
  if (envValue === undefined) {
    return NextResponse.json(
      { error: 'Server misconfiguration: ACCESS_ISSUE_ENABLED is not defined.' },
      { status: 500 }
    );
  }

  const issueEnabled = envValue === 'true';

  // Si no está habilitada, bloqueamos emisión
  if (!issueEnabled) {
    return NextResponse.json(
      { error: 'Access key issuing is currently disabled by administrator.' },
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