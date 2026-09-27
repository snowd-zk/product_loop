import { NextResponse } from 'next/server';
import { simulatedAudienceAgent } from '@/lib/agents/simulated-audience-agent';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.canvas) {
      return NextResponse.json(
        { success: false, error: 'Missing presentation canvas payload' },
        { status: 400 }
      );
    }

    const rehearsal = await simulatedAudienceAgent.simulateRehearsal(
      body.canvas, 
      body.personas
    );

    return NextResponse.json({
      success: true,
      rehearsal
    });
  } catch (error) {
    console.error('Presentation Rehearsal error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to simulate audience rehearsal' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const personas = simulatedAudienceAgent.getSupportedPersonas();
  return NextResponse.json({
    success: true,
    personas
  });
}
