import { NextResponse } from 'next/server';

export async function GET() {
  const isConfigured = !!process.env.GOOGLE_GENAI_API_KEY;

  return NextResponse.json({
    status: isConfigured ? 'healthy' : 'misconfigured',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    apiKeyConfigured: isConfigured,
  });
}
