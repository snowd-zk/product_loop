import { NextResponse } from 'next/server';
import { presentationMicroEditor } from '@/lib/agents/presentation-micro-editor';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.canvas || !body.command) {
      return NextResponse.json(
        { success: false, error: 'Missing canvas or command payload' },
        { status: 400 }
      );
    }

    const { updatedCanvas, message } = await presentationMicroEditor.applyMicroEdit(
      body.canvas,
      body.command
    );

    return NextResponse.json({
      success: true,
      canvas: updatedCanvas,
      message
    });
  } catch (error) {
    console.error('Presentation Micro-edit error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to apply micro edit' },
      { status: 500 }
    );
  }
}
