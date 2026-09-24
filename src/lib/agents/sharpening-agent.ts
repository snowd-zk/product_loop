import { RawSignal, SharpenedHypothesis } from '@/types/product-loop';

export class SharpeningAgent {
  /**
   * Raw signal이나 막연한 아이디어를 가설과 실험 설계로 샤프닝(Sharpening)합니다.
   * "화면을 만들어줘"가 아닌 "무엇을 해결하려 하는가"를 뾰족하게 만드는 핵심 단계입니다.
   */
  public async sharpenIdea(signal: RawSignal): Promise<SharpenedHypothesis> {
    const text = signal.rawText.trim();

    // Default intelligent parser / sharpening generator
    // 실제 환경에서는 LLM API(Gemini / OpenAI / Anthropic)를 호출합니다.
    const title = text.length > 40 ? text.slice(0, 37) + '...' : text;

    return {
      id: `hypo-${Date.now()}`,
      title: `[가설] ${title}`,
      summary: `사용자 보이스/지표 신호("${text}")를 해결하기 위해 전환 단계의 마찰을 제거하고 탐색 직관성을 강화하는 실험`,
      targetUser: '핵심 서비스 탐색 중 이탈 위험이 있는 신규 및 미전환 유저 (가입 후 7일 이내)',
      coreProblem: `사용자가 다음 행동(탐색, 검색, 전환)으로 이어지는 가치 제안을 즉각적으로 인지하지 못해 발생한 인게이지먼트 정체`,
      proposedSolution: `핵심 액션으로 유도하는 맥락적 추천 카드 및 인터랙티브 프리뷰를 최상단에 노출`,
      comparisonBaseline: `현재 기본 UI (단순 링크 나열 및 텍스트 위주 안내 화면, 평균 전환율 2.4%)`,
      successMetrics: {
        primary: `핵심 액션 클릭률 (CTR) 2.4% -> 5.5% 달성 (+3.1%p)`,
        targetDelta: `+130% 상대 전환 상승`,
        guardrail: `첫 로딩 속도(LCP) < 1.2s 유지 및 기존 핵심 네비게이션 클릭률 하락 방지 (< -2%)`
      },
      controlVariables: [
        '기존 검색 결과 랭킹 알고리즘 동일 유지',
        '모바일/데스크톱 50:50 A/B 트래픽 스플릿 적용',
        '프로모션 배너 기간과 실험 기간 비중복 통제'
      ],
      risksAndAssumptions: [
        '가정: 사용자가 시각적 프리뷰를 보면 클릭 의사결정 시간이 단축될 것이다.',
        '리스크: 상단 영역 확대로 인해 아래쪽 본문 콘텐츠 노출이 줄어들 수 있음.'
      ],
      status: 'sharpened'
    };
  }
}

export const sharpeningAgent = new SharpeningAgent();
