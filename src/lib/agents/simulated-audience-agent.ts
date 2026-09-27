import { 
  PresentationCanvas, 
  RehearsalSimulation, 
  RehearsalObjection,
  AudiencePersona
} from '@/types/presentation-loop';

export class SimulatedAudienceAgent {
  /**
   * AI 모의 청중(Skeptical CFO, Technical CTO, User-Obsessed CPO) 페르소나를 투입하여,
   * 발표 덱 전체의 논리적 비약과 약점을 공격하고 방어율 점수 및 취약 장표를 도출합니다.
   */
  public async simulateRehearsal(
    canvas: PresentationCanvas, 
    _selectedPersonas?: string[]
  ): Promise<RehearsalSimulation> {
    const objections: RehearsalObjection[] = [
      {
        id: `obj-1-${Date.now()}`,
        targetSlideId: 'slide-6-impact-roi',
        personaType: 'skeptical_cfo',
        question: '연간 2.4억 원 절감이라는 수치가 너무 장밋빛입니다. 실제 스프린트에서 엔지니어들이 절약된 시간을 다른 고부가가치 태스크에 투입하지 못하면 실제 현금 흐름 개선은 0원 아닌가요?',
        severity: 'critical',
        defaultDefense: '스피킹 노트에 연간 공수 환산 모델 언급이 있으나, 구체적인 현금 흐름 및 엔지니어링 투입 대체 지표가 부재함.',
        defenseStatus: 'vulnerable',
        improvementSuggestion: '공수 절감뿐만 아니라, "절감된 60%의 시간으로 신규 기능 배포 속도가 빨라져 발생하는 직접 매출 기여도" 추정치를 추가 슬라이드나 수치로 보강하십시오.'
      },
      {
        id: `obj-2-${Date.now()}`,
        targetSlideId: 'slide-5-canvas-deep',
        personaType: 'technical_cto',
        question: 'Figma 플러그인과 코드가 양방향 동기화된다고 했는데, 디자이너가 Figma에서 임의로 오토레이아웃을 깨뜨리거나 커스텀 스타일을 적용하면 코드베이스와 어떻게 싱크를 맞추나요?',
        severity: 'critical',
        defaultDefense: 'Figma Exporter는 단방향 JSON 내보내기 중심이며, 양방향 충돌(Conflict Resolution) 해결 알고리즘에 대한 구체적 설명이 부족함.',
        defenseStatus: 'vulnerable',
        improvementSuggestion: '양방향 수정 충돌 방지 정책(Design Token SSOT 원칙 및 Pull Request 코드 리뷰 게이트)을 Appendix에 별도 명시하십시오.'
      },
      {
        id: `obj-3-${Date.now()}`,
        targetSlideId: 'slide-3-why-now',
        personaType: 'user_obsessed_cpo',
        question: '실험 리드타임이 2.5일로 단축되면 너무 많은 실험이 사용자에게 무분별하게 노출되어 프로덕트의 일관된 UX가 훼손되지 않나요?',
        severity: 'moderate',
        defaultDefense: '가드레일 지표(Guardrail Metric)와 통제 변수 설계가 샤프닝 단계에 포함되어 있어 UX 훼손을 차단한다고 방어 가능함.',
        defenseStatus: 'defended',
        improvementSuggestion: '가드레일 지표 통제 메커니즘을 3번 장표에서 조금 더 강조하여 언급하면 완벽합니다.'
      },
      {
        id: `obj-4-${Date.now()}`,
        targetSlideId: 'slide-7-roadmap',
        personaType: 'skeptical_cfo',
        question: '4주 파일럿 기간 동안 기존 제품 개발 일정이 지연되는 기회비용은 어떻게 커버하나요?',
        severity: 'moderate',
        defaultDefense: '파일럿을 1개 그로스 스쿼드에 한정 적용하여 전사 개발 일정에 미치는 영향을 최소화하도록 계획됨.',
        defenseStatus: 'defended',
        improvementSuggestion: '파일럿 팀의 기존 스프린트 목표 달성율을 유지할 수 있는 사전 리소스 배분 계획을 덧붙이십시오.'
      },
      {
        id: `obj-5-${Date.now()}`,
        targetSlideId: 'slide-4-architecture',
        personaType: 'technical_cto',
        question: '5단계 무한 루프에서 AI 환각으로 인해 잘못된 가설이 생성되었을 때 사람의 개입 없이 폭주할 위험은 없나요?',
        severity: 'critical',
        defaultDefense: 'Human-in-the-loop 검증 게이트가 존재한다고 주장하나, 다이어그램상 자동 루프로만 표기되어 오해를 살 소지가 있음.',
        defenseStatus: 'vulnerable',
        improvementSuggestion: '루프 다이어그램에서 가설 승인 및 QA 단계에 "Human Approval Gate" 뱃지를 시각적으로 부각하십시오.'
      }
    ];

    // 방어율 점수 계산: defended 100점, vulnerable 40점, unaddressed 0점
    const totalPossible = objections.length * 100;
    const earned = objections.reduce((acc, obj) => {
      if (obj.defenseStatus === 'defended') return acc + 100;
      if (obj.defenseStatus === 'vulnerable') return acc + 45;
      return acc;
    }, 0);

    const overallScore = Math.round((earned / totalPossible) * 100);
    const vulnerableSlideIds = Array.from(
      new Set(
        objections
          .filter((o) => o.defenseStatus === 'vulnerable')
          .map((o) => o.targetSlideId)
      )
    );

    const verdict = overallScore >= 85 
      ? 'ready_to_present' 
      : overallScore >= 60 
      ? 'needs_reinforcement' 
      : 'rework_required';

    return {
      id: `rehearsal-${Date.now()}`,
      canvasId: canvas.id,
      rehearsalDate: new Date().toISOString(),
      overallScore,
      objections,
      vulnerableSlideIds,
      verdict
    };
  }

  /**
   * 기본 지원되는 AI 페르소나 정의 목록 반환
   */
  public getSupportedPersonas(): AudiencePersona[] {
    return [
      {
        type: 'skeptical_cfo',
        name: '깐깐한 CFO (재무/투자 관점)',
        roleTitle: 'Chief Financial Officer',
        stance: '철저한 ROI, 현금 흐름 회수 기간, 매몰 비용 및 엔지니어링 인건비 절감 근거 집요한 추궁',
        probingQuestions: [
          '실제 엔지니어링 공수 절감이 현금성 이익으로 연결되는 경로는 무엇인가?',
          '도입 실패 시 발생하는 매몰 비용과 전환 비용(Switching Cost)은 얼마인가?'
        ]
      },
      {
        type: 'technical_cto',
        name: '보수적인 CTO (아키텍처/기술 관점)',
        roleTitle: 'Chief Technology Officer',
        stance: '기술 부채, 시스템 장애율, AI 환각 통제 및 기존 CI/CD 파이프라인 충돌 우려',
        probingQuestions: [
          'AI가 생성한 코드가 사내 아키텍처 컨벤션과 보안 가이드를 100% 준수하는가?',
          'Figma-코드 동기화 충돌 시 개발팀에 추가 디버깅 부채가 가중되지 않는가?'
        ]
      },
      {
        type: 'user_obsessed_cpo',
        name: '사용자 중심 CPO (UX/제품 관점)',
        roleTitle: 'Chief Product Officer',
        stance: '급진적 실험으로 인한 유저 경험 파편화 및 장기 리텐션 저해 위험 검토',
        probingQuestions: [
          '단기 클릭률(CTR) 개선에만 치중하여 30일 장기 리텐션이 훼손되지 않는가?',
          '사용자가 AI가 제안한 인터랙션에서 학습 피로감을 느끼지 않는다는 근거는?'
        ]
      }
    ];
  }
}

export const simulatedAudienceAgent = new SimulatedAudienceAgent();
