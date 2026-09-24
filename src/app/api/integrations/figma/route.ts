import { NextResponse } from 'next/server';
import { figmaExporterAgent } from '@/lib/agents/figma-exporter';
import { ProjectCanvas } from '@/types/product-loop';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const canvas: ProjectCanvas = body.canvas;

    if (!canvas) {
      return NextResponse.json({ success: false, error: 'Canvas is required' }, { status: 400 });
    }

    const figmaPayload = figmaExporterAgent.exportToFigmaSchema(canvas);
    return NextResponse.json({ success: true, figmaPayload });
  } catch (error) {
    console.error('Figma export error:', error);
    return NextResponse.json({ success: false, error: 'Failed to export to Figma' }, { status: 500 });
  }
}
