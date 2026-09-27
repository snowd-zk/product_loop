import { 
  PresentationCanvas, 
  RehearsalSimulation, 
  PresentationFlywheel,
  SlideItem,
  MECETreeNode 
} from '@/types/presentation-loop';

export class PresentationFlywheelAgent {
  /**
   * 모의 리허설의 공방 결과(방어 성공/실패 지점)를 분석하여
   * 설득 레슨런을 도출하고, 취약점을 즉각 메우는 보강 장표(Appendix)를 자동 삽입하여
   * 다음 사이클(Cycle #N+1)의 보강된 프레젠테이션 캔버스를 구축합니다.
   */
  public async runFlywheel(
    canvas: PresentationCanvas, 
    rehearsal: RehearsalSimulation,
    cycle: number = 1
  ): Promise<{ flywheel: PresentationFlywheel; updatedCanvas: PresentationCanvas }> {
    // 1. 성공 요인 및 실패 요인 정리
    const whatConvinced = [
      '가드레일 지표(Guardrail Metric)와 통제 변수 설계를 통한 UX 훼손 방지 논리 성공적 방어',
      '전사 전면 도입 대신 1개 그로스 스쿼드 한정 4주 파일럿을 통한 리스크 분산 전략 호평',
      '기존 단일 AI 시안과 대비한 "프로젝트 한 판"의 차별적 효용성 인정'
    ];

    const whatFailed = [
      'CFO 관점: 엔지니어링 공수 절감이 실질적 현금 흐름 개선으로 연결되는 정량적 ROI 모델 부재',
      'CTO 관점: Figma와 코드 간의 양방향 스타일 충돌(Conflict) 해결 정책 및 보안 기준 설명 미흡',
      'CPO 관점: 5단계 루프 다이어그램에서 사람의 최종 승인(Human-in-the-loop) 게이트 시각적 표현 누락'
    ];

    const nextDeckRevisions = [
      {
        title: 'CFO 방어 전용: 현금 흐름 및 엔지니어링 투입 대체 ROI 모델 Appendix 장표 추가',
        actionType: 'add_appendix' as const,
        description: '연간 2.4억원 절감의 산출 근거를 팀별 시간 단축 및 신규 기능 출시 속도 증가분으로 세분화'
      },
      {
        title: 'CTO 방어 전용: Figma 디자인 토큰 SSOT 원칙 및 PR 머지 게이트 Appendix 장표 추가',
        actionType: 'add_appendix' as const,
        description: '디자인 시스템 토큰 불일치 시 자동 린트(Lint) 검증 및 코드 베이스 보호 파이프라인 명시'
      },
      {
        title: '루프 다이어그램에 "Human Approval Gate" 시각적 뱃지 반영',
        actionType: 'restructure_pillar' as const,
        description: '4번 슬라이드 아키텍처 다이어그램에 AI 독자 판단이 아닌 사람 승인 게이트가 필수임을 시각화'
      }
    ];

    const flywheel: PresentationFlywheel = {
      id: `flywheel-${Date.now()}`,
      cycleNumber: cycle,
      rehearsalRefId: rehearsal.id,
      verdict: rehearsal.verdict,
      whatConvinced,
      whatFailed,
      nextDeckRevisions
    };

    // 2. 취약점을 메우는 보강 장표 2종 자동 생성 (Cycle #N+1 적용)
    const appendixCFO: SlideItem = {
      id: `slide-9-appendix-cfo-${Date.now()}`,
      nodeId: 'node-appendix-cfo',
      slideNumber: canvas.slides.length + 1,
      layoutType: 'appendix_faq',
      headMessage: '[CFO 전용] 시간 단축 효과는 신규 핵심 기능 조기 배포로 이어져 분기당 6천만원의 직접 매출 기회를 창출합니다.',
      subTitle: 'Appendix A: Engineering Cost Substitution & Direct Cashflow Model',
      components: [
        {
          id: 'c-9-1',
          type: 'metric_card',
          title: '스쿼드당 연간 공수 회수액',
          data: {
            baseline: '기존 연간 1,840시간 회의/조율',
            target: '연간 1,470시간 확보 (79% 절감)',
            highlight: true
          }
        },
        {
          id: 'c-9-2',
          type: 'comparison_table',
          title: '절약된 엔지니어링 리소스 재배치 시나리오',
          data: {
            leftTitle: '과거 리소스 소모 구조',
            leftItems: [
              '스프린트당 기획-디자인 싱크 회의 18시간',
              '누락된 에러/로딩 상태 재개발 24시간',
              '단발성 실험 폐기 시 매몰 비용 발생'
            ],
            rightTitle: '개선 후 가치 창출 구조',
            rightItems: [
              '실험 검증 완료된 핵심 기능 고도화에 투입 (+45%)',
              '신규 전환 기능 릴리즈 주기 2주 단축',
              '분기별 전환 매출 기여도 최소 6천만원 이상 창출'
            ]
          }
        }
      ],
      speakerNotes: {
        script: `CFO님께서 지적해 주신 현금 흐름 우려에 대한 세부 산출 모델입니다. 엔지니어들의 절약된 1,470시간은 단순히 노는 시간이 아니라, 분기별 2개 이상의 고부가가치 유료 전환 기능을 2주 먼저 시장에 출시하는 직접 매출 동력으로 환원됩니다.`,
        soWhatBridge: '이로써 투자 회수 기간은 파일럿 시작 후 2.8개월 이내로 단축됩니다.',
        estimatedSeconds: 90
      },
      visualTokens: {
        accentColor: '#10B981',
        badgeText: 'APPENDIX A (CFO DEFENSE)'
      }
    };

    const appendixCTO: SlideItem = {
      id: `slide-10-appendix-cto-${Date.now()}`,
      nodeId: 'node-appendix-cto',
      slideNumber: canvas.slides.length + 2,
      layoutType: 'appendix_faq',
      headMessage: '[CTO 전용] Figma 단방향 SSOT 원칙과 Git Pull Request 리뷰 게이트로 기술 부채와 충돌을 원천 차단합니다.',
      subTitle: 'Appendix B: Design System SSOT & Conflict Resolution Architecture',
      components: [
        {
          id: 'c-10-1',
          type: 'diagram',
          title: '디자인-코드 동기화 안전 파이프라인',
          data: {
            steps: [
              { step: '1. Token SSOT', desc: '코드베이스 tokens.json이 단일 진실 공급원' },
              { step: '2. Lint Check', desc: 'Figma 프레임 생성 시 토큰 불일치 자동 감지' },
              { step: '3. PR Gate', desc: '엔지니어 코드 리뷰 승인 없이는 메인 브랜치 머지 불가' },
              { step: '4. Fallback', desc: '이상 발생 시 이전 릴리즈 1-클릭 롤백' }
            ]
          }
        }
      ],
      speakerNotes: {
        script: `CTO님께서 우려하신 양방향 충돌 및 기술 부채는 코드베이스를 단일 진실 공급원(SSOT)으로 삼는 불변 정책으로 해결합니다. Figma에서 디자이너가 임의의 스타일을 주더라도 PR 게이트에서 린터가 감지하여 머지를 차단하므로 사내 인프라를 100% 안전하게 보호합니다.`,
        soWhatBridge: '이를 통해 개발팀의 유지보수 오버헤드를 0으로 유지합니다.',
        estimatedSeconds: 90
      },
      visualTokens: {
        accentColor: '#3B82F6',
        badgeText: 'APPENDIX B (CTO DEFENSE)'
      }
    };

    // 4번 슬라이드 수정 (Human Approval Gate 명시)
    const updatedSlides = canvas.slides.map((s) => {
      if (s.id === 'slide-4-architecture') {
        return {
          ...s,
          headMessage: '가설 샤프닝부터 캔버스, QA까지 5단계 폐쇄 루프로 돌되, 모든 단계에 [Human Approval Gate]를 필수로 배치합니다.',
          components: [
            {
              id: 'c-4-1',
              type: 'diagram' as const,
              title: '5단계 무한 루프 파이프라인 (Human-in-the-Loop)',
              data: {
                steps: [
                  { step: '1. Signal', desc: '슬랙 / 지표 인입' },
                  { step: '2. Sharpening', desc: '가설 샤프닝 [★사람 승인]' },
                  { step: '3. Canvas', desc: '명세+시안 한 판 [★미세 수정]' },
                  { step: '4. QA & Deploy', desc: 'QA 시나리오 [★개발자 승인]' },
                  { step: '5. Flywheel', desc: '실측 판정 & 다음 가설 3종' }
                ]
              }
            }
          ]
        };
      }
      return s;
    });

    const finalSlides = [...updatedSlides, appendixCFO, appendixCTO];

    // 마인드맵 트리에 새 Appendix 노드 주입
    const updatedTree: MECETreeNode = {
      ...canvas.mindmapTree,
      children: [
        ...canvas.mindmapTree.children,
        {
          id: 'node-appendix-cfo',
          label: 'Appendix A: CFO ROI 및 현금 흐름 분석',
          level: 1,
          slideRefId: appendixCFO.id,
          isExpanded: true,
          children: []
        },
        {
          id: 'node-appendix-cto',
          label: 'Appendix B: CTO 토큰 SSOT & PR 안전 게이트',
          level: 1,
          slideRefId: appendixCTO.id,
          isExpanded: true,
          children: []
        }
      ]
    };

    const updatedCanvas: PresentationCanvas = {
      ...canvas,
      updatedAt: new Date().toISOString(),
      slides: finalSlides,
      mindmapTree: updatedTree
    };

    return { flywheel, updatedCanvas };
  }
}

export const presentationFlywheelAgent = new PresentationFlywheelAgent();
