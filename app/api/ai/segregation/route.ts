import { NextRequest, NextResponse } from 'next/server';
import { classifyWasteDemo } from '@/ai/segregation-agent';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const hint = body?.hint || '';
  const result = classifyWasteDemo(hint);
  return NextResponse.json({ result });
}
