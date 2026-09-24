import { SharpenedHypothesis, ProjectCanvas, ScreenState, FlowEdge, SpecDocument } from '@/types/product-loop';

export class CanvasGeneratorAgent {
  /**
   * 샤프닝된 가설을 바탕으로 [명세 + 시안(상태별 화면) + 플로우]가
   * 결합된 '프로젝트 한 판'을 생성합니다.
   */
  public async generateProjectCanvas(hypothesis: SharpenedHypothesis): Promise<ProjectCanvas> {
    const canvasId = `canvas-${Date.now()}`;

    // 1. 명세 (PRD Spec Document)
    const spec: SpecDocument = {
      id: `spec-${Date.now()}`,
      title: `${hypothesis.title} - 프로덕트 구현 명세서`,
      version: '1.0.0',
      overview: `${hypothesis.summary}에 대한 요구사항 및 엣지 케이스 명세`,
      userStories: [
        '유저는 탐색 화면 진입 시, 나의 관심사와 직결된 추천 액션을 시각적 카드로 한눈에 볼 수 있다.',
        '유저는 추천 카드를 탭했을 때 즉각적인 피드백과 함께 다음 액션 플로우로 끊김 없이 이동한다.',
        '유저는 네트워크 지연 또는 추천 결과가 없을 때도 명확한 다음 행동 가이드를 제공받는다.'
      ],
      functionalRequirements: [
        {
          id: 'FR-1',
          feature: '맥락적 인텔리전트 추천 카드 컴포넌트',
          behavior: '유저의 최근 행동 로그를 기반으로 최대 3개의 관련 액션을 뱃지 및 프리뷰 요약과 함께 상단에 렌더링',
          priority: 'P0'
        },
        {
          id: 'FR-2',
          feature: '상태별 인터랙티브 피드백',
          behavior: '클릭 시 스켈레톤 대신 인라인 로더를 적용하고 0.2초 이내 반응 애니메이션 제공',
          priority: 'P0'
        },
        {
          id: 'FR-3',
          feature: '텔레메트리 및 실험 지표 태깅',
          behavior: '추천 카드 노출(Impression), 탭(Click), 전환 완료(Conversion) 이벤트를 A/B 버킷 ID와 함께 로깅',
          priority: 'P0'
        }
      ],
      edgeCases: [
        '네트워크 오프라인 혹은 응답 지연 (2초 초과 시 캐시된 기본 추천 폴백 노출)',
        '신규 유저로 이전 세션 로그가 전무한 경우: 온보딩 인기 카테고리 3선 노출',
        '유저가 3회 연속 카드를 닫거나 스킵한 경우: 48시간 동안 상단 추천 축소형 배너로 전환'
      ],
      acceptanceCriteria: [
        '모바일(375px)과 데스크톱(1440px) 모두에서 레이아웃 시프트(CLS < 0.05) 없이 렌더링될 것',
        'A/B 분기 로직이 세션 동안 일관되게 유지될 것',
        '지표 이벤트 수집 누락률이 0.1% 미만일 것'
      ]
    };

    // 2. 시안 (Multi-State Screen Matrix)
    const screens: ScreenState[] = [
      {
        id: 'screen-1-default',
        name: '화면 1: 기본 진입 상태 (Default)',
        stateType: 'default',
        description: '유저가 첫 진입했을 때 상단에 샤프닝된 추천 카드가 노출되는 기준 화면',
        components: [
          { name: 'AppHeader', type: 'Header', propsSummary: 'title, searchInput, userAvatar' },
          { name: 'HeroContextCard', type: 'Card', propsSummary: 'title: "지금 많이 찾는 탐색 토픽", badges: ["AI", "Research"]' },
          { name: 'QuickActionBar', type: 'ActionGroup', propsSummary: 'buttons: ["1분 퀵 서머리", "심층 분석 시작"]' },
          { name: 'ContentFeed', type: 'List', propsSummary: 'items: 10, variant: standard' }
        ]
      },
      {
        id: 'screen-2-active',
        name: '화면 2: 카드 선택 인터랙션 (Active)',
        stateType: 'active',
        description: '유저가 특정 추천 카드를 탭하여 상세 프리뷰와 즉각 액션 팝오버가 활성화된 상태',
        components: [
          { name: 'AppHeader', type: 'Header', propsSummary: 'active: true' },
          { name: 'HeroContextCard', type: 'Card', propsSummary: 'status: expanded, selectedId: "topic-1"' },
          { name: 'PreviewDrawer', type: 'Drawer', propsSummary: 'title: "심층 가설 요약", autoFocus: true' },
          { name: 'ConfirmButton', type: 'Button', propsSummary: 'variant: brand-fill, label: "이 방향으로 진행하기"' }
        ]
      },
      {
        id: 'screen-3-loading',
        name: '화면 3: 탐색/생성 진행 상태 (Loading)',
        stateType: 'loading',
        description: '추천을 실행한 직후 AI 에이전트가 백그라운드 데이터를 조합하는 동안의 체감 속도 최적화 화면',
        components: [
          { name: 'AppHeader', type: 'Header', propsSummary: 'locked: true' },
          { name: 'AgentProgressMeter', type: 'Progress', propsSummary: 'steps: ["자료 수집", "가설 분석", "시안 조립"], activeStep: 2' },
          { name: 'ShimmerCards', type: 'SkeletonGroup', propsSummary: 'count: 3, pulseAnimation: true' }
        ]
      },
      {
        id: 'screen-4-empty-error',
        name: '화면 4: 엣지 케이스 및 폴백 (Edge Case)',
        stateType: 'error',
        description: '결과가 없거나 통신 실패 시 유저 이탈을 방지하고 대체 추천을 제안하는 방어적 화면',
        components: [
          { name: 'AppHeader', type: 'Header', propsSummary: 'status: alert' },
          { name: 'FallbackIllustration', type: 'Graphic', propsSummary: 'type: "gentle-retry"' },
          { name: 'RetryButton', type: 'Button', propsSummary: 'label: "다시 시도하기", secondaryAction: "기본 화면으로 돌아가기"' },
          { name: 'AlternativeSuggestions', type: 'ChipGroup', propsSummary: 'items: ["트렌드 리포트", "커뮤니티 가이드"]' }
        ]
      }
    ];

    // 3. 플로우 (User Journey Connection)
    const flows: FlowEdge[] = [
      {
        id: 'flow-1',
        fromScreenId: 'screen-1-default',
        toScreenId: 'screen-2-active',
        triggerAction: '유저가 [HeroContextCard] 탭',
        condition: '카테고리 선택 완료 시'
      },
      {
        id: 'flow-2',
        fromScreenId: 'screen-2-active',
        toScreenId: 'screen-3-loading',
        triggerAction: '유저가 [이 방향으로 진행하기] 클릭',
        condition: '유효한 세션 인증 완료 시'
      },
      {
        id: 'flow-3',
        fromScreenId: 'screen-3-loading',
        toScreenId: 'screen-1-default',
        triggerAction: 'AI 생성 완료 후 결과 렌더링',
        condition: 'HTTP 200 OK & Data Payload 수신'
      },
      {
        id: 'flow-4',
        fromScreenId: 'screen-3-loading',
        toScreenId: 'screen-4-empty-error',
        triggerAction: '네트워크 타임아웃(2.5초 초과) 또는 5xx 오류 발생',
        condition: '오프라인 또는 API 실패 시 즉각 폴백'
      }
    ];

    return {
      id: canvasId,
      hypothesisId: hypothesis.id,
      title: `${hypothesis.title} - 프로젝트 한 판`,
      createdAt: new Date().toISOString(),
      spec,
      screens,
      flows,
      designTokens: {
        primaryColor: '#0C893B', // Liner's iconic signature green
        surfaceColor: '#F8F9FA',
        borderRadius: '12px'
      }
    };
  }
}

export const canvasGeneratorAgent = new CanvasGeneratorAgent();
