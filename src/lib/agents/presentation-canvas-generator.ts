import { 
  SharpenedPyramid, 
  PresentationCanvas, 
  MECETreeNode, 
  SlideItem 
} from '@/types/presentation-loop';

export class PresentationCanvasGenerator {
  /**
   * 샤프닝된 피라미드(Governing Thought & 3 Pillars)를 바탕으로
   * 인터랙티브 MECE 논리 트리와 8~10장의 비즈니스 슬라이드 '발표 한 판'을 생성합니다.
   */
  public async generateCanvas(pyramid: SharpenedPyramid): Promise<PresentationCanvas> {
    const canvasId = `pres-canvas-${Date.now()}`;
    const p1 = pyramid.pillars[0];
    const p2 = pyramid.pillars[1];
    const p3 = pyramid.pillars[2];

    // 1. 슬라이드 배열 정의 (Slide Items)
    const slides: SlideItem[] = [
      // 슬라이드 1: 표지
      {
        id: 'slide-1-cover',
        nodeId: 'node-root',
        slideNumber: 1,
        layoutType: 'title_cover',
        headMessage: pyramid.governingThought,
        subTitle: `청중: ${pyramid.targetAudience.role} | 소요 시간: ${pyramid.presentationConstraints.targetDurationMinutes}분`,
        components: [
          {
            id: 'c-1-1',
            type: 'head_message',
            title: 'Executive Pitch Deck',
            data: {
              badge: 'STRATEGIC PROPOSAL',
              title: pyramid.governingThought,
              meta: `타깃: ${pyramid.targetAudience.role} • 승인 목표: 전사 도입 및 리소스 승인`
            }
          },
          {
            id: 'c-1-2',
            type: 'metric_card',
            title: '핵심 약속 지표 (North Star Target)',
            data: {
              metric: '80% 단축',
              label: '제품 실험 리드타임',
              subtext: '11.4일 → 2.5일 미만',
              highlight: true
            }
          }
        ],
        speakerNotes: {
          script: `안녕하십니까, 오늘 보고드릴 내용은 "${pyramid.governingThought}"입니다. 현재 우리 팀이 겪고 있는 개별 AI 생산성과 조직 전체 속도 간의 괴리를 해소하고, 즉시 검증 가능한 무한 루프 시스템을 제안드립니다.`,
          soWhatBridge: '먼저 왜 지금 이 시스템이 시급한지, 기존 방식의 치명적 병목부터 살펴보겠습니다.',
          estimatedSeconds: 90
        },
        visualTokens: {
          accentColor: '#2563EB',
          badgeText: 'COVER'
        }
      },

      // 슬라이드 2: 경영진 요약 (Executive Summary)
      {
        id: 'slide-2-summary',
        nodeId: 'node-root-summary',
        slideNumber: 2,
        layoutType: 'executive_summary',
        headMessage: '단일 화면 제작의 한계를 넘어 기획·시안·검증을 단일 캔버스로 묶어 전사 속도를 4배 가속화합니다.',
        subTitle: 'Executive Summary: 3대 논리 기둥 요약',
        components: [
          {
            id: 'c-2-1',
            type: 'column_grid',
            title: '3 MECE Logic Pillars',
            data: {
              columns: [
                {
                  badge: 'Why Now',
                  title: '조직 속도 정체',
                  desc: '개별 AI 도구(v0, Claude)의 파편화로 협업 리드타임 60%가 소모됨',
                  keyMetric: '기존 리드타임 11.4일'
                },
                {
                  badge: 'How It Works',
                  title: '프로젝트 한 판 + 루프',
                  desc: '가설 샤프닝 → 명세+4개 시안+플로우 캔버스 → 자동 QA 및 레슨런',
                  keyMetric: '30초 원클릭 한 판 빌드'
                },
                {
                  badge: 'Impact & ROI',
                  title: '연간 2.4억원 절감',
                  desc: '실험 빈도 4배 확대 및 실패 기능의 조기 중단으로 매몰비용 제거',
                  keyMetric: '실험 빈도 월 12건 (+300%)'
                }
              ]
            }
          }
        ],
        speakerNotes: {
          script: `바쁘신 임원분들을 위해 핵심 1장으로 요약드립니다. 우리는 'Why Now', 'How It Works', 'Impact & ROI'라는 3가지 명확한 축을 기반으로, 단순히 도구를 바꾸는 것이 아니라 팀의 업무 순환 방식을 근본적으로 재설계합니다.`,
          soWhatBridge: '그렇다면 첫 번째 축인 기존 방식의 한계점을 구체적으로 짚어보겠습니다.',
          estimatedSeconds: 120
        },
        visualTokens: {
          accentColor: '#3B82F6',
          badgeText: 'EXECUTIVE SUMMARY'
        }
      },

      // 슬라이드 3: Pillar 1 (Why Now)
      {
        id: 'slide-3-why-now',
        nodeId: 'node-p1',
        slideNumber: 3,
        layoutType: 'problem_solution_split',
        headMessage: p1.keyArgument,
        subTitle: p1.title,
        components: [
          {
            id: 'c-3-1',
            type: 'comparison_table',
            title: '기존 단일 AI 도구 vs 폐쇄 루프 시스템',
            data: {
              leftTitle: '기존 방식 (단일 화면 시안)',
              leftItems: [
                '화면 하나만 예쁘게 생성 (상태별 플로우 부재)',
                '기획 명세(PRD)와 디자인 분리로 전달 손실 발생',
                '실험 후 지표 분석이 다음 가설로 연결되지 않고 단발성 종료'
              ],
              rightTitle: '개선 방향 (프로젝트 한 판 루프)',
              rightItems: [
                'Default/Active/Loading/Edge 4개 상태를 한눈에 리뷰',
                '명세 + 시안 + 플로우가 단일 캔버스에서 실시간 동기화',
                '검증 지표에서 레슨런을 뽑아 후속 가설 3종 자동 생성'
              ]
            }
          },
          {
            id: 'c-3-2',
            type: 'metric_card',
            title: p1.evidenceData[0].metricName,
            data: {
              baseline: p1.evidenceData[0].baselineValue,
              target: p1.evidenceData[0].projectedValue,
              source: p1.evidenceData[0].sourceRef
            }
          }
        ],
        speakerNotes: {
          script: `보시다시피 현재 팀원들이 v0나 Claude를 쓰며 화면 하나는 금방 만듭니다. 하지만 로딩 상태는 어디 있는지, 에러 나면 어떻게 되는지, 기획 명세는 어디 있는지 다시 회의를 잡아야 합니다. 이 과정에서 11일이 날아갑니다.`,
          soWhatBridge: '이 문제를 해결하기 위해 고안한 아키텍처가 바로 "프로젝트 한 판"입니다.',
          estimatedSeconds: 120
        },
        visualTokens: {
          accentColor: '#EF4444',
          badgeText: 'PILLAR 1: WHY NOW'
        }
      },

      // 슬라이드 4: Pillar 2 (How It Works)
      {
        id: 'slide-4-architecture',
        nodeId: 'node-p2',
        slideNumber: 4,
        layoutType: 'three_pillars_overview',
        headMessage: p2.keyArgument,
        subTitle: p2.title,
        components: [
          {
            id: 'c-4-1',
            type: 'diagram',
            title: '5단계 무한 루프 파이프라인',
            data: {
              steps: [
                { step: '1. Signal', desc: '슬랙 대화 / 지표 이상 감지' },
                { step: '2. Sharpening', desc: '타깃/지표/가드레일 가설 샤프닝' },
                { step: '3. Canvas', desc: '명세 + 4개 시안 + 플로우 한 판' },
                { step: '4. QA & Deploy', desc: '시나리오 자동 검증 및 A/B 배포' },
                { step: '5. Flywheel', desc: '실측 판정 & 다음 가설 3종 재진입' }
              ]
            }
          }
        ],
        speakerNotes: {
          script: `이 아키텍처는 Liner Pencil의 검증된 방식을 계승합니다. 신호 인입부터 가설 샤프닝, 한 판 캔버스, QA 배포, 레슨런 플라이휠까지 5단계가 하나의 원처럼 맞물려 돌아가며, 사람이 멈추지 않는 한 영구적으로 순환합니다.`,
          soWhatBridge: '캔버스 내부에서 어떻게 손처럼 미세 수정이 일어나는지 구체적으로 보겠습니다.',
          estimatedSeconds: 120
        },
        visualTokens: {
          accentColor: '#10B981',
          badgeText: 'PILLAR 2: ARCHITECTURE'
        }
      },

      // 슬라이드 5: Pillar 2 심화 (Micro-Iteration & Figma)
      {
        id: 'slide-5-canvas-deep',
        nodeId: 'node-p2-deep',
        slideNumber: 5,
        layoutType: 'architecture_flow',
        headMessage: '한 판이 나온 즉시 자연어 명령으로 미세 수정하고, 클릭 한 번으로 Figma 및 코드로 동기화합니다.',
        subTitle: 'Micro-Iteration & Multi-Toolchain Sync',
        components: [
          {
            id: 'c-5-1',
            type: 'column_grid',
            title: '주요 협업 기능',
            data: {
              columns: [
                {
                  badge: '손처럼 쓰는 AI',
                  title: 'Micro-Iteration',
                  desc: '"하단 탭바로 교체", "다크 토큰 적용" 등 즉각 국소 수정'
                },
                {
                  badge: '원클릭 동기화',
                  title: 'Figma Exporter',
                  desc: 'Figma 프레임 및 스티커 메모 JSON으로 즉시 복사하여 디자이너 연동'
                },
                {
                  badge: '실행 보장',
                  title: 'QA Checklist',
                  desc: '기능/엣지케이스/성능 자동 시나리오 추출로 배포 리스크 방지'
                }
              ]
            }
          }
        ],
        speakerNotes: {
          script: `AI가 한 판을 뽑아내면, 디자이너나 PM이 마음에 안 드는 부분을 말로 수정합니다. 그리고 버튼을 누르면 Figma 플러그인 호환 JSON으로 바로 복사되어 디자인 시스템 팀과의 마찰을 완전히 없앱니다.`,
          soWhatBridge: '이제 가장 중요한 비즈니스 임팩트와 재무적 ROI를 살펴보겠습니다.',
          estimatedSeconds: 100
        },
        visualTokens: {
          accentColor: '#059669',
          badgeText: 'PILLAR 2: CANVAS DEEP DIVE'
        }
      },

      // 슬라이드 6: Pillar 3 (Impact & ROI)
      {
        id: 'slide-6-impact-roi',
        nodeId: 'node-p3',
        slideNumber: 6,
        layoutType: 'deep_dive_metrics',
        headMessage: p3.keyArgument,
        subTitle: p3.title,
        components: [
          {
            id: 'c-6-1',
            type: 'metric_card',
            title: '월간 실험 실행 빈도',
            data: {
              baseline: '월 2~3건',
              target: '월 12건 이상 (+300%)',
              highlight: true
            }
          },
          {
            id: 'c-6-2',
            type: 'metric_card',
            title: '연간 엔지니어링 리소스 절감액',
            data: {
              baseline: '0원',
              target: '약 2.4억원 절감',
              highlight: true
            }
          },
          {
            id: 'c-6-3',
            type: 'metric_card',
            title: '가설 검증 리드타임',
            data: {
              baseline: '11.4일',
              target: '2.5일 (-78%)',
              highlight: true
            }
          }
        ],
        speakerNotes: {
          script: `재무적 수치로 환산하면, 스프린트당 커뮤니케이션 오버헤드와 실패 기능의 조기 발견으로 연간 약 2.4억 원의 공수 낭비를 막을 수 있습니다. 동시에 실험 빈도는 4배 이상 늘어나 제품의 시장 검증 속도가 비약적으로 향상됩니다.`,
          soWhatBridge: '이를 실제 조직에 도입하기 위한 단계별 4주 로드맵을 말씀드리겠습니다.',
          estimatedSeconds: 120
        },
        visualTokens: {
          accentColor: '#8B5CF6',
          badgeText: 'PILLAR 3: IMPACT & ROI'
        }
      },

      // 슬라이드 7: 실행 로드맵 (Roadmap)
      {
        id: 'slide-7-roadmap',
        nodeId: 'node-roadmap',
        slideNumber: 7,
        layoutType: 'timeline_roadmap',
        headMessage: '4주 파일럿을 통해 핵심 스쿼드 1개에 선적용하고, 검증 지표 달성 후 전사로 확산합니다.',
        subTitle: '4-Week Phased Rollout Plan',
        components: [
          {
            id: 'c-7-1',
            type: 'column_grid',
            title: '단계별 롤아웃 계획',
            data: {
              columns: [
                {
                  badge: 'Week 1',
                  title: '환경 셋업 및 토큰 연동',
                  desc: '기존 Figma 디자인 시스템 토큰 매핑 및 슬랙 봇 연동'
                },
                {
                  badge: 'Week 2',
                  title: '1개 파일럿 스쿼드 적용',
                  desc: '그로스 스쿼드 대상 3회 루프 파일럿 실행 및 리드타임 측정'
                },
                {
                  badge: 'Week 3',
                  title: 'QA 및 피드백 튜닝',
                  desc: '엣지케이스 감지율 및 Figma 내보내기 편의성 개선'
                },
                {
                  badge: 'Week 4',
                  title: '전사 공유 및 확대 승인',
                  desc: '파일럿 성과 지표 보고 및 프로덕트 전 조직 확산'
                }
              ]
            }
          }
        ],
        speakerNotes: {
          script: `전체 팀에 한 번에 도입하는 무리수를 두지 않습니다. 1주 차에 디자인 토큰을 연동하고, 2주 차에 가장 실험이 활발한 그로스 스쿼드에 파일럿으로 투입하여 실측 데이터를 확보한 뒤 전사로 점진 확장하겠습니다.`,
          soWhatBridge: '마지막으로 경영진 및 리더십에서 우려하실 수 있는 질문에 대해 사전 답변을 드리겠습니다.',
          estimatedSeconds: 90
        },
        visualTokens: {
          accentColor: '#6366F1',
          badgeText: 'ACTION PLAN: ROADMAP'
        }
      },

      // 슬라이드 8: Q&A 사전 방어 (Appendix & FAQ)
      {
        id: 'slide-8-appendix',
        nodeId: 'node-appendix',
        slideNumber: 8,
        layoutType: 'appendix_faq',
        headMessage: '기술 부채 방지, AI 환각 통제, 기존 툴체인과의 100% 호환성을 보장합니다.',
        subTitle: 'Appendix: Key Objections & Defense',
        components: [
          {
            id: 'c-8-1',
            type: 'comparison_table',
            title: '예상 질문 및 방어 논리 (FAQ)',
            data: {
              leftTitle: 'CFO / CTO 핵심 우려 사항',
              leftItems: [
                'Q: AI가 엉뚱한 명세를 만들면 개발팀에 기술 부채가 되지 않는가?',
                'Q: 도입 비용 대비 실제 효과 측정이 객관적으로 가능한가?',
                'Q: 기존 디자이너들이 사용하는 Figma 작업 방식을 해치지 않는가?'
              ],
              rightTitle: '시스템적 통제 및 방어 대책',
              rightItems: [
                'A: 4단계 QA 체크리스트와 개발자 최종 승인 게이트를 필수로 두어 무결성 보장',
                'A: Jira/Git 티켓의 리드타임 텔레메트리를 통해 실제 단축 일수를 대시보드에 투명 공시',
                'A: Figma 원본 프레임 및 오토레이아웃으로 직접 내보내므로 기존 워크플로우 100% 흡수'
              ]
            }
          }
        ],
        speakerNotes: {
          script: `가장 우려하실 수 있는 품질과 호환성 부분은 4단계 QA 게이트와 Figma 직접 내보내기를 통해 완전하게 방어할 수 있도록 설계되었습니다. 경청해 주셔서 감사합니다. 질문 주시면 답변드리겠습니다.`,
          soWhatBridge: '이상으로 발표를 마칩니다. 질의응답을 진행하겠습니다.',
          estimatedSeconds: 90
        },
        visualTokens: {
          accentColor: '#475569',
          badgeText: 'APPENDIX: Q&A DEFENSE'
        }
      }
    ];

    // 2. MECE 마인드맵 트리 구조 빌드 (MECETreeNode)
    const mindmapTree: MECETreeNode = {
      id: 'node-root',
      label: `[Governing Thought]\n${pyramid.governingThought}`,
      level: 0,
      slideRefId: 'slide-1-cover',
      isExpanded: true,
      children: [
        {
          id: 'node-root-summary',
          label: 'Executive Summary (3대 축 요약)',
          level: 1,
          slideRefId: 'slide-2-summary',
          isExpanded: true,
          children: []
        },
        {
          id: 'node-p1',
          label: p1.title,
          level: 1,
          slideRefId: 'slide-3-why-now',
          isExpanded: true,
          children: [
            {
              id: 'node-p1-sub1',
              label: '기존 단일 AI 시안의 한계 vs 폐쇄 루프',
              level: 2,
              slideRefId: 'slide-3-why-now',
              children: [],
              isExpanded: false
            }
          ]
        },
        {
          id: 'node-p2',
          label: p2.title,
          level: 1,
          slideRefId: 'slide-4-architecture',
          isExpanded: true,
          children: [
            {
              id: 'node-p2-sub1',
              label: '5단계 무한 루프 파이프라인 구조',
              level: 2,
              slideRefId: 'slide-4-architecture',
              children: [],
              isExpanded: false
            },
            {
              id: 'node-p2-deep',
              label: 'Micro-Iteration & Figma 원클릭 동기화',
              level: 2,
              slideRefId: 'slide-5-canvas-deep',
              children: [],
              isExpanded: false
            }
          ]
        },
        {
          id: 'node-p3',
          label: p3.title,
          level: 1,
          slideRefId: 'slide-6-impact-roi',
          isExpanded: true,
          children: [
            {
              id: 'node-p3-sub1',
              label: '실측 지표 (리드타임 80% 단축 & 2.4억원 절감)',
              level: 2,
              slideRefId: 'slide-6-impact-roi',
              children: [],
              isExpanded: false
            },
            {
              id: 'node-roadmap',
              label: '4주 단계적 롤아웃 계획',
              level: 2,
              slideRefId: 'slide-7-roadmap',
              children: [],
              isExpanded: false
            }
          ]
        },
        {
          id: 'node-appendix',
          label: 'Appendix: Q&A 사전 방어 및 FAQ',
          level: 1,
          slideRefId: 'slide-8-appendix',
          isExpanded: true,
          children: []
        }
      ]
    };

    return {
      id: canvasId,
      pyramidId: pyramid.id,
      title: `${pyramid.governingThought.slice(0, 30)}... 발표 한 판`,
      updatedAt: new Date().toISOString(),
      mindmapTree,
      slides,
      globalTheme: {
        palette: 'enterprise_slate',
        fontFamily: 'Inter, system-ui, sans-serif',
        aspectRatio: '16:9'
      }
    };
  }
}

export const presentationCanvasGenerator = new PresentationCanvasGenerator();
