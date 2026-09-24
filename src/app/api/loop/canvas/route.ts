import { NextResponse } from 'next/server';
import { canvasGeneratorAgent } from '@/lib/agents/canvas-generator';
import { SharpenedHypothesis } from '@/types/product-loop';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const hypothesis: SharpenedHypothesis = body.hypothesis;

    if (!hypothesis) {
      return NextResponse.json({ success: false, error: 'Hypothesis is required' }, { status: 400 });
    }

    const canvas = await canvasGeneratorAgent.generateProjectCanvas(hypothesis);
    return NextResponse.json({ success: true, canvas });
  } catch (error) {
    console.error('Canvas generation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate canvas' }, { status: 500 });
  }
}
