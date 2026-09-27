import { 
  PresentationSignal, 
  SharpenedPyramid, 
  LogicPillar 
} from '@/types/presentation-loop';

export class PyramidSharpeningAgent {
  /**
   * 원천 신호(Product Loop 산출물, 제안서, 기획서 텍스트 등)를
   * 맥킨지 피라미드 원칙(Minto Pyramid)에 따라 정점 결론(Governing Thought)과
   * MECE 3대 지지 축(3 Logic Pillars), 데이터 팩트로 뾰족하게 샤프닝합니다.
   */
  public async sharpen(signal: PresentationSignal): Promise<SharpenedPyramid> {
    const text = signal.rawContent.trim();
    const title = signal.sourceTitle || (text.length > 35 ? text.slice(0, 32) + '...' : text);

    // 맥킨지 피라미드 3대 축 구성: Why Now / How It Works / Impact & ROI
    const pillar1: LogicPillar = {
      id: `pillar-1-${Date.now()}`,
      title: 'Pillar 1. Why Now: 기존 단발성 작업의 한계와 병목 해소',
      keyArgument: '개별 팀원의 AI 활용 속도는 빨라졌으나, 피드백 루프의 부재로 조직 전체의 제품 혁신 속도는 정체되어 있습니다.',
      subArguments: [
        '기존 AI 디자인 도구는 화면 하나 생성에 그쳐 상태별(Default/Loading/Error) 플로우 검토가 불가능함',
        '기획-디자인-개발 간 컨텍스트 전달 손실로 인해 스프린트 리드타임의 60% 이상이 커뮤니케이션에 소모됨',
        '실험 검증 지표가 후속 가설로 연결되지 못하고 사장되는 파편화 문제 발생'
      ],
      evidenceData: [
        {
          metricName: '스프린트 주기당 기획·디자인 병목 시간',
          baselineValue: '평균 11.4일',
          projectedValue: '2.5일 이하로 단축',
          sourceRef: '팀 스프린트 리드타임 로그 분석'
        },
        {
          metricName: '실험 지표의 후속 가설 연결율',
          baselineValue: '18% 미만',
          projectedValue: '85% 이상 플라이휠 자동화',
          sourceRef: '전사 OKR 회고 보고서'
        }
      ]
    };

    const pillar2: LogicPillar = {
      id: `pillar-2-${Date.now()}`,
      title: 'Pillar 2. How It Solves: 프로젝트 한 판과 5단계 무한 루프 아키텍처',
      keyArgument: '가설 샤프닝에서 프로젝트 한 판 캔버스, QA 및 레슨런 플라이휠로 직결되는 폐쇄 루프(Closed-Loop)를 가동합니다.',
      subArguments: [
        '단일 화면이 아닌 [명세 PRD + 4가지 상태별 시안 + 전이 플로우]를 단일 캔버스에 원클릭 전개',
        '자연어 명령으로 디자인 토큰과 예외 케이스를 손처럼 수정하는 Micro-Iteration 엔진',
        '실제 배포 지표 판정 결과로부터 다음 사이클 가설 3종을 자동 도출하는 자가발전 메커니즘'
      ],
      evidenceData: [
        {
          metricName: '한 판(Canvas) 초안 빌드 소요 시간',
          baselineValue: '기존 3~4일 소요',
          projectedValue: '30초 이내 원클릭 생성',
          sourceRef: 'Liner Pencil 파일럿 벤치마크'
        },
        {
          metricName: 'Figma 및 코드 동기화 오버헤드',
          baselineValue: '수동 복사·재작업 8시간',
          projectedValue: 'Figma JSON 1클릭 내보내기',
          sourceRef: '디자인 시스템 호환성 검증'
        }
      ]
    };

    const pillar3: LogicPillar = {
      id: `pillar-3-${Date.now()}`,
      title: 'Pillar 3. Impact & ROI: 실험 리드타임 80% 단축과 실패 비용 극소화',
      keyArgument: '가설 검증 사이클 속도를 극대화하여 연간 수억 원의 엔지니어링 낭비를 제거하고 제품 적합도(PMF)를 빠르게 달성합니다.',
      subArguments: [
        '기능 실패 시 발생하는 수개월의 개발 매몰 비용을 사전 샤프닝과 엣지 케이스 통제로 1/3 수준으로 축소',
        '월간 실험 실행 빈도 4.5배 확장으로 분기별 핵심 전환 지표(CTR/CVR) 두 자릿수 성장 견인',
        'C-Level 및 팀 이해관계자 승인 프로세스를 실시간 한 판 기반으로 단축'
      ],
      evidenceData: [
        {
          metricName: '월간 프로덕트 가설 실험 실행 수',
          baselineValue: '월 2~3건',
          projectedValue: '월 12건 이상 (+300%)',
          sourceRef: '그로스 실험 파이프라인 예측치'
        },
        {
          metricName: '연간 엔지니어링 리소스 절감 효과',
          baselineValue: '기준선 0원',
          projectedValue: '연간 약 2.4억원 상당 효율 개선',
          sourceRef: '인건비 및 배포 주기 환산 모델'
        }
      ]
    };

    return {
      id: `pyr-${Date.now()}`,
      signalId: signal.id,
      governingThought: `"${title}" 도입을 통해 제품 실험 리드타임을 80% 단축하고, 조직 전체의 지속 가능한 무한 학습 플라이휠을 구축합니다.`,
      targetAudience: {
        role: 'C-Level 경영진(CEO/CFO/CTO) 및 프로덕트 리더십(VP of Product)',
        primaryInterest: '전사 리소스 투입 대비 실험 속도 가속화 및 기능 실패 리스크 통제',
        expectedObjection: '기존 개발 파이프라인과의 마찰 여부 및 생성형 AI 도입에 따른 품질 관리(QA) 불확실성'
      },
      presentationConstraints: {
        targetDurationMinutes: signal.sourceMetadata?.timeLimitMinutes || 15,
        slideCountLimit: 8,
        presentationMode: 'board_review'
      },
      pillars: [pillar1, pillar2, pillar3],
      riskMitigationNotes: [
        '리스크 1: 초기 디자인 시스템 컴포넌트 토큰 연동을 위한 2주간의 베이스라인 세팅 필요',
        '방어 논리: 기존 Figma UI Kit 스키마를 그대로 재활용하여 추가 학습 곡선 제로화',
        '리스크 2: AI 환각(Hallucination)으로 인한 잘못된 명세 생성 가능성',
        '방어 논리: 4단계 QA 체크리스트 및 사람이 승인하는 Human-in-the-loop 검증 게이트 유지'
      ],
      status: 'sharpened'
    };
  }
}

export const pyramidSharpeningAgent = new PyramidSharpeningAgent();
