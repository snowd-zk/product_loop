import { NextResponse } from 'next/server';
import { pyramidSharpeningAgent } from '@/lib/agents/pyramid-sharpening-agent';
import { PresentationSignal } from '@/types/presentation-loop';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawContent = body.rawText || body.rawContent || 'Liner Pencil 기반 무한 프로덕트 루프 전사 도입 및 리드타임 단축 방안';
    const sourceTitle = body.title || 'Product Loop 전사 전략 제안';

    const signal: PresentationSignal = {
      id: `sig-pres-${Date.now()}`,
      source: body.source || 'product_loop',
      sourceTitle,
      rawContent,
      sourceMetadata: {
        productLoopSessionId: body.productLoopSessionId,
        targetAudienceHint: body.targetAudienceHint || 'C-Level 경영진',
        timeLimitMinutes: body.timeLimitMinutes || 15
      },
      timestamp: new Date().toISOString()
    };

    const pyramid = await pyramidSharpeningAgent.sharpen(signal);

    return NextResponse.json({
      success: true,
      signal,
      pyramid
    });
  } catch (error) {
    console.error('Presentation Sharpening error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sharpen presentation pyramid' },
      { status: 500 }
    );
  }
}
