import { NextResponse } from 'next/server';
import { sharpeningAgent } from '@/lib/agents/sharpening-agent';
import { RawSignal } from '@/types/product-loop';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawText = body.rawText || '검색 결과 화면의 추천 질문 클릭률 개선 방안';
    const signal: RawSignal = {
      id: `sig-${Date.now()}`,
      source: body.source || 'manual',
      rawText,
      timestamp: new Date().toISOString()
    };

    const hypothesis = await sharpeningAgent.sharpenIdea(signal);
    return NextResponse.json({ success: true, signal, hypothesis });
  } catch (error) {
    console.error('Sharpening error:', error);
    return NextResponse.json({ success: false, error: 'Failed to sharpen idea' }, { status: 500 });
  }
}
