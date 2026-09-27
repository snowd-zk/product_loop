import { NextResponse } from 'next/server';
import { presentationFlywheelAgent } from '@/lib/agents/presentation-flywheel-agent';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.canvas || !body.rehearsal) {
      return NextResponse.json(
        { success: false, error: 'Missing canvas or rehearsal payload' },
        { status: 400 }
      );
    }

    const cycle = body.cycle || 1;
    const { flywheel, updatedCanvas } = await presentationFlywheelAgent.runFlywheel(
      body.canvas,
      body.rehearsal,
      cycle
    );

    return NextResponse.json({
      success: true,
      flywheel,
      updatedCanvas
    });
  } catch (error) {
    console.error('Presentation Flywheel error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to run presentation flywheel' },
      { status: 500 }
    );
  }
}
