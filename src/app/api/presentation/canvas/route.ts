import { NextResponse } from 'next/server';
import { presentationCanvasGenerator } from '@/lib/agents/presentation-canvas-generator';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.pyramid) {
      return NextResponse.json(
        { success: false, error: 'Missing sharpened pyramid payload' },
        { status: 400 }
      );
    }

    const canvas = await presentationCanvasGenerator.generateCanvas(body.pyramid);

    return NextResponse.json({
      success: true,
      canvas
    });
  } catch (error) {
    console.error('Presentation Canvas generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate presentation canvas' },
      { status: 500 }
    );
  }
}
