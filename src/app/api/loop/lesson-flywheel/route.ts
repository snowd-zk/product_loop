import { NextResponse } from 'next/server';
import { lessonFlywheelAgent } from '@/lib/agents/lesson-flywheel';
import { SharpenedHypothesis } from '@/types/product-loop';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const hypothesis: SharpenedHypothesis = body.hypothesis;
    const actualMetrics = body.actualMetrics || { primaryValue: '클릭률 5.2% 달성 (+2.8%p)' };

    if (!hypothesis) {
      return NextResponse.json({ success: false, error: 'Hypothesis is required' }, { status: 400 });
    }

    const lessonsLearned = await lessonFlywheelAgent.analyzeAndExtractLessons(hypothesis, actualMetrics);
    return NextResponse.json({ success: true, lessonsLearned });
  } catch (error) {
    console.error('Lesson flywheel error:', error);
    return NextResponse.json({ success: false, error: 'Failed to extract lessons' }, { status: 500 });
  }
}
