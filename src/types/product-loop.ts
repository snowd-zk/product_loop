export type LoopPhase = 
  | 'signal'          // 1. 지표 / 유저 보이스 / 슬랙 트리거
  | 'sharpening'      // 2. 가설 샤프닝 (Sharpening)
  | 'canvas'          // 3. 프로젝트 한 판 (명세 + 시안 + 플로우)
  | 'execution_qa'    // 4. 개발 & QA 체크리스트
  | 'evaluation'      // 5. 지표 검증 & 레슨런 (Lessons-Learned)
  | 'next_hypothesis';// 6. 다음 가설 연결 (무한 루프)

export interface RawSignal {
  id: string;
  source: 'slack' | 'metrics_alert' | 'user_voice' | 'manual';
  rawText: string;
  author?: string;
  timestamp: string;
  contextUrl?: string;
}

export interface SharpenedHypothesis {
  id: string;
  title: string;
  summary: string;
  targetUser: string;
  coreProblem: string;
  proposedSolution: string;
  comparisonBaseline: string;
  successMetrics: {
    primary: string;
    targetDelta: string;
    guardrail: string;
  };
  controlVariables: string[];
  risksAndAssumptions: string[];
  status: 'draft' | 'sharpened' | 'approved';
}

export interface SpecDocument {
  id: string;
  title: string;
  version: string;
  overview: string;
  userStories: string[];
  functionalRequirements: {
    id: string;
    feature: string;
    behavior: string;
    priority: 'P0' | 'P1' | 'P2';
  }[];
  edgeCases: string[];
  acceptanceCriteria: string[];
}

export interface ScreenState {
  id: string;
  name: string;
  stateType: 'default' | 'loading' | 'active' | 'success' | 'empty' | 'error';
  description: string;
  components: {
    name: string;
    type: string;
    propsSummary: string;
  }[];
  previewData?: Record<string, unknown>;
}

export interface FlowEdge {
  id: string;
  fromScreenId: string;
  toScreenId: string;
  triggerAction: string;
  condition?: string;
}

export interface ProjectCanvas {
  id: string;
  hypothesisId: string;
  title: string;
  createdAt: string;
  spec: SpecDocument;
  screens: ScreenState[];
  flows: FlowEdge[];
  designTokens: {
    primaryColor: string;
    surfaceColor: string;
    borderRadius: string;
  };
}

export interface QACheckItem {
  id: string;
  category: 'functional' | 'ui_ux' | 'edge_case' | 'performance';
  scenario: string;
  expectedResult: string;
  status: 'passed' | 'failed' | 'pending';
}

export interface LessonLearned {
  id: string;
  experimentTitle: string;
  duration: string;
  baselineMetric: string;
  actualResult: string;
  delta: string;
  verdict: 'validated' | 'invalidated' | 'inconclusive';
  keyInsights: string[];
  whatWorked: string[];
  whatFailed: string[];
  nextHypotheses: {
    title: string;
    rationale: string;
  }[];
}

export interface ProductLoopSession {
  currentCycle: number;
  currentPhase: LoopPhase;
  signal?: RawSignal;
  hypothesis?: SharpenedHypothesis;
  canvas?: ProjectCanvas;
  qaChecklist: QACheckItem[];
  lessonsLearned?: LessonLearned;
}
