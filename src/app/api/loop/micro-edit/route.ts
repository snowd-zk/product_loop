import { NextResponse } from 'next/server';
import { microEditorAgent } from '@/lib/agents/micro-editor';
import { ProjectCanvas } from '@/types/product-loop';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const canvas: ProjectCanvas = body.canvas;
    const instruction: string = body.instruction || '';

    if (!canvas || !instruction) {
      return NextResponse.json({ success: false, error: 'Canvas and instruction are required' }, { status: 400 });
    }

    const result = await microEditorAgent.applyMicroEdit(canvas, instruction);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Micro edit error:', error);
    return NextResponse.json({ success: false, error: 'Failed to apply micro edit' }, { status: 500 });
  }
}
