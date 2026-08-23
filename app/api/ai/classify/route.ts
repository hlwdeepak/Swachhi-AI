import { NextRequest, NextResponse } from 'next/server';
import { classifyComplaint } from '@/ai/grievance-agent';

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  if (!text) return NextResponse.json({ error: 'text required' }, { status: 400 });

  const result = await classifyComplaint(text);
  return NextResponse.json({ result });
}
