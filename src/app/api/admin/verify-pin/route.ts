import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { pin } = await req.json();
    const adminPin = process.env.ADMIN_SECRET_PIN || 'WBH2026!';
    
    if (pin === adminPin) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
