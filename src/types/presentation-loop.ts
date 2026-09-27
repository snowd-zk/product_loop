/**
 * Presentation Loop 핵심 데이터 모델 및 타입 정의
 * - 맥킨지 피라미드 (MECE) 샤프닝
 * - 트리 & 마인드맵 중심 발표 한 판 (Presentation Canvas)
 * - AI 모의 청중 (Simulated Audience) 리허설 및 방어율
 * - 설득 레슨런 플라이휠 (Lessons-Learned Flywheel)
 */

export type PresentationLoopPhase =
  | 'signal'          // 1. 원천 자료 인제스천
  | 'sharpening'      // 2. MECE 피라미드 샤프닝
  | 'canvas'          // 3. 발표 한 판 (트리 & 슬라이드 캔버스)
  | 'rehearsal'       // 4. AI 모의 청중 리허설
  | 'flywheel'        // 5. 설득 레슨런 & 보강 덱 순환
  | 'final_export';   // 6. PPTX / PDF 최종 내보내기

export interface PresentationSignal {
  id: string;
  source: 'product_loop' | 'manual_text' | 'prd_document' | 'meeting_notes';
  sourceTitle: string;
  rawContent: string;
  sourceMetadata?: {
    productLoopSessionId?: string;
    targetAudienceHint?: string;
    timeLimitMinutes?: number;
  };
  timestamp: string;
}

export interface LogicPillar {
  id: string;
  title: string;
  keyArgument: string;
  subArguments: string[];
  evidenceData: {
    metricName: string;
    baselineValue: string;
    projectedValue: string;
    sourceRef?: string;
  }[];
}

export interface SharpenedPyramid {
  id: string;
  signalId: string;
  governingThought: string;
  targetAudience: {
    role: string;
    primaryInterest: string;
    expectedObjection: string;
  };
  presentationConstraints: {
    targetDurationMinutes: number;
    slideCountLimit: number;
    presentationMode: 'live_pitch' | 'asynchronous_reading' | 'board_review';
  };
  pillars: [LogicPillar, LogicPillar, LogicPillar];
  riskMitigationNotes: string[];
  status: 'draft' | 'sharpened' | 'approved';
}

export type SlideLayoutType =
  | 'title_cover'
  | 'executive_summary'
  | 'problem_solution_split'
  | 'three_pillars_overview'
  | 'deep_dive_metrics'
  | 'architecture_flow'
  | 'timeline_roadmap'
  | 'appendix_faq';

export interface MECETreeNode {
  id: string;
  label: string;
  level: 0 | 1 | 2; // 0: Governing Thought, 1: Logic Pillar, 2: Individual Slide
  slideRefId?: string;
  children: MECETreeNode[];
  isExpanded: boolean;
}

export interface SlideComponent {
  id: string;
  type: 'head_message' | 'metric_card' | 'column_grid' | 'comparison_table' | 'quote_box' | 'diagram';
  title?: string;
  data: Record<string, unknown>;
}

export interface SlideItem {
  id: string;
  nodeId: string;
  slideNumber: number;
  layoutType: SlideLayoutType;
  headMessage: string;
  subTitle?: string;
  components: SlideComponent[];
  speakerNotes: {
    script: string;
    soWhatBridge: string;
    estimatedSeconds: number;
  };
  visualTokens: {
    accentColor: string;
    badgeText?: string;
  };
}

export interface PresentationCanvas {
  id: string;
  pyramidId: string;
  title: string;
  updatedAt: string;
  mindmapTree: MECETreeNode;
  slides: SlideItem[];
  globalTheme: {
    palette: 'enterprise_slate' | 'tech_indigo' | 'growth_emerald' | 'minimal_dark';
    fontFamily: string;
    aspectRatio: '16:9' | '4:3';
  };
}

export type AudiencePersonaType = 'skeptical_cfo' | 'technical_cto' | 'user_obsessed_cpo' | 'vc_investor';

export interface AudiencePersona {
  type: AudiencePersonaType;
  name: string;
  roleTitle: string;
  stance: string;
  probingQuestions: string[];
}

export interface RehearsalObjection {
  id: string;
  targetSlideId: string;
  personaType: AudiencePersonaType;
  question: string;
  severity: 'critical' | 'moderate' | 'minor';
  defaultDefense: string;
  defenseStatus: 'defended' | 'vulnerable' | 'unaddressed';
  improvementSuggestion: string;
}

export interface RehearsalSimulation {
  id: string;
  canvasId: string;
  rehearsalDate: string;
  overallScore: number;
  objections: RehearsalObjection[];
  vulnerableSlideIds: string[];
  verdict: 'ready_to_present' | 'needs_reinforcement' | 'rework_required';
}

export interface PresentationFlywheel {
  id: string;
  cycleNumber: number;
  rehearsalRefId: string;
  verdict: 'ready_to_present' | 'needs_reinforcement' | 'rework_required';
  whatConvinced: string[];
  whatFailed: string[];
  nextDeckRevisions: {
    title: string;
    actionType: 'add_appendix' | 'restructure_pillar' | 'replace_metric';
    description: string;
  }[];
}

export interface PresentationLoopSession {
  currentCycle: number;
  currentPhase: PresentationLoopPhase;
  signal?: PresentationSignal;
  pyramid?: SharpenedPyramid;
  canvas?: PresentationCanvas;
  rehearsal?: RehearsalSimulation;
  flywheel?: PresentationFlywheel;
}
