'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Layout, 
  GitBranch, 
  RefreshCw, 
  Download, 
  Copy, 
  Check, 
  AlertCircle, 
  TrendingUp, 
  Sliders, 
  Send,
  Zap, 
  Terminal, 
  Target, 
  ShieldCheck, 
  ChevronRight, 
  Eye, 
  CornerDownRight,
  Maximize2
} from 'lucide-react';
import { 
  SharpenedHypothesis, 
  ProjectCanvas, 
  LessonLearned, 
  LoopPhase,
  ScreenState
} from '@/types/product-loop';
import HeaderNav from '@/components/HeaderNav';
import ExternalShareModal from '@/components/ExternalShareModal';
import ScreenDetailModal from '@/components/ScreenDetailModal';

// 기본 프리셋 시그널
const SAMPLE_SIGNALS = [
  {
    category: '검색 전환',
    text: 'Liner 검색 결과창에서 추천 질문 클릭률(CTR)이 2.4%로 저조하여 탐색 전환 개선 필요'
  },
  {
    category: '수익화/온보딩',
    text: '무료 유저가 유료 플랜 모달 진입 시 이탈률이 78%에 달해 가치 제안 재설계 필요'
  },
  {
    category: '아이디어 제안',
    text: '슬랙 스레드 아이디어: "모바일에서 긴 검색 결과 대신 1분 퀵 서머리 카드를 상단에 주면 어떨까요?"'
  }
];

export default function ProductLoopDashboard() {
  const [cycle, setCycle] = useState(1);
  const [currentPhase, setCurrentPhase] = useState<LoopPhase>('signal');
  const [rawInput, setRawInput] = useState(SAMPLE_SIGNALS[0].text);
  const [loadingStep, setLoadingStep] = useState<string | null>(null);

  // States
  const [hypothesis, setHypothesis] = useState<SharpenedHypothesis | null>(null);
  const [canvas, setCanvas] = useState<ProjectCanvas | null>(null);
  const [activeCanvasTab, setActiveCanvasTab] = useState<'spec' | 'screens' | 'flows'>('screens');
  const [microPrompt, setMicroPrompt] = useState('');
  const [microEditHistory, setMicroEditHistory] = useState<string[]>([]);
  const [lessons, setLessons] = useState<LessonLearned | null>(null);
  const [copiedFigma, setCopiedFigma] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  // Modals
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [inspectScreen, setInspectScreen] = useState<ScreenState | null>(null);

  // 1. Sharpening Trigger
  const handleSharpen = async (textToSharpen?: string) => {
    const text = textToSharpen || rawInput;
    if (!text) return;
    setLoadingStep('sharpen');
    try {
      const res = await fetch('/api/loop/sharpen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: text, source: 'manual' })
      });
      const data = await res.json();
      if (data.success) {
        setHypothesis(data.hypothesis);
        setCurrentPhase('sharpening');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStep(null);
    }
  };

  // 2. Generate "한 판" (Canvas)
  const handleGenerateCanvas = async () => {
    if (!hypothesis) return;
    setLoadingStep('canvas');
    try {
      const res = await fetch('/api/loop/canvas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hypothesis })
      });
      const data = await res.json();
      if (data.success) {
        setCanvas(data.canvas);
        setCurrentPhase('canvas');
        setActiveCanvasTab('screens');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStep(null);
    }
  };

  // 3. Apply Micro Edit
  const handleMicroEdit = async (customInstruction?: string) => {
    const instruction = customInstruction || microPrompt;
    if (!canvas || !instruction) return;
    setLoadingStep('micro-edit');
    try {
      const res = await fetch('/api/loop/micro-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canvas, instruction })
      });
      const data = await res.json();
      if (data.success) {
        setCanvas(data.updatedCanvas);
        setMicroEditHistory(prev => [data.changeSummary, ...prev]);
        setMicroPrompt('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStep(null);
    }
  };

  // 4. Run Lessons-Learned Flywheel
  const handleExtractLessons = async () => {
    if (!hypothesis) return;
    setLoadingStep('flywheel');
    try {
      const res = await fetch('/api/loop/lesson-flywheel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hypothesis })
      });
      const data = await res.json();
      if (data.success) {
        setLessons(data.lessonsLearned);
        setCurrentPhase('evaluation');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStep(null);
    }
  };

  // 5. Spin Next Hypothesis (무한 루프)
  const handleStartNextCycle = (nextTitle: string) => {
    setCycle(prev => prev + 1);
    setRawInput(nextTitle);
    setHypothesis(null);
    setCanvas(null);
    setLessons(null);
    setMicroEditHistory([]);
    setCurrentPhase('signal');
    handleSharpen(nextTitle);
  };

  // Reset Loop
  const handleResetLoop = () => {
    setCycle(1);
    setHypothesis(null);
    setCanvas(null);
    setLessons(null);
    setMicroEditHistory([]);
    setCurrentPhase('signal');
  };

  // Export Figma Payload
  const handleExportFigma = async () => {
    if (!canvas) return;
    try {
      const res = await fetch('/api/integrations/figma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canvas })
      });
      const data = await res.json();
      navigator.clipboard.writeText(JSON.stringify(data.figmaPayload, null, 2));
      setCopiedFigma(true);
      setTimeout(() => setCopiedFigma(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Copy Markdown PRD
  const handleCopyMarkdown = () => {
    if (!canvas) return;
    const md = `# ${canvas.spec.title}\n\n## 1. 개요\n${canvas.spec.overview}\n\n## 2. 유저 스토리\n${canvas.spec.userStories.map(s => `- ${s}`).join('\n')}\n\n## 3. 기능 요구사항\n${canvas.spec.functionalRequirements.map(f => `- **[${f.priority}] ${f.feature}**: ${f.behavior}`).join('\n')}\n\n## 4. 엣지 케이스\n${canvas.spec.edgeCases.map(e => `- ${e}`).join('\n')}\n\n## 5. 승인 기준 (Acceptance Criteria)\n${canvas.spec.acceptanceCriteria.map(a => `- ${a}`).join('\n')}`;
    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Global Header Navigation with App Switcher & External Access Modal Trigger */}
      <HeaderNav
        activeApp="product"
        cycle={cycle}
        currentPhase={currentPhase}
        onReset={handleResetLoop}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Signal Input & Sharpening Panel (Col 4) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          
          {/* 1. Signal / Seed Input */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700/80 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <h2 className="font-semibold text-sm text-slate-200">1. 신호 &amp; 아이디어 인입</h2>
              </div>
              <span className="text-[11px] text-slate-400">Slack / 지표 / CS</span>
            </div>

            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="막연한 가설이나 유저 피드백, 지표 문제를 입력하세요..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 min-h-[95px] resize-none leading-relaxed transition"
            />

            {/* Presets */}
            <div className="mt-3 flex flex-col gap-1.5">
              <span className="text-[10px] text-slate-500 font-medium">자주 발생하는 시그널 프리셋:</span>
              {SAMPLE_SIGNALS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setRawInput(sample.text);
                    handleSharpen(sample.text);
                  }}
                  className="text-left text-[11px] text-slate-400 hover:text-emerald-300 hover:bg-slate-800/60 p-2.5 rounded-xl transition-all border border-slate-800/60 hover:border-emerald-500/30 flex items-start gap-2 group"
                >
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 shrink-0">
                    {sample.category}
                  </span>
                  <span className="line-clamp-1 leading-snug">{sample.text}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => handleSharpen()}
              disabled={loadingStep === 'sharpen' || !rawInput.trim()}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-medium text-xs py-2.5 px-4 rounded-xl transition-all shadow-md shadow-emerald-950 min-h-[44px]"
            >
              {loadingStep === 'sharpen' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  가설 샤프닝 분석 중...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  가설 샤프닝 실행 (Sharpening)
                </>
              )}
            </button>
          </section>

          {/* 2. Sharpened Hypothesis Result Card */}
          {hypothesis && (
            <section className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-lg shadow-emerald-950/20 flex flex-col gap-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-semibold text-sm text-slate-100">2. 샤프닝된 가설 설계</h3>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                  SHARPENED
                </span>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">타깃 사용자 (Target User)</span>
                  <p className="text-slate-200 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    {hypothesis.targetUser}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">대조 기준선 (Baseline)</span>
                  <p className="text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    {hypothesis.comparisonBaseline}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">핵심 성공 지표 (Primary Metric)</span>
                  <div className="bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-xl text-emerald-300 font-medium flex items-center gap-1.5">
                    <span className="text-base">🎯</span>
                    <span>{hypothesis.successMetrics.primary}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">가드레일 &amp; 통제 변수</span>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-400 text-[11px] space-y-1">
                    <p>🛡️ <strong className="text-slate-300">Guardrail:</strong> {hypothesis.successMetrics.guardrail}</p>
                    <p>⚖️ <strong className="text-slate-300">Control:</strong> {hypothesis.controlVariables[0]}</p>
                  </div>
                </div>
              </div>

              {/* Generate Canvas Button */}
              <button
                onClick={handleGenerateCanvas}
                disabled={loadingStep === 'canvas'}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-90 text-white font-semibold text-xs py-3 px-4 rounded-xl transition-all shadow-lg shadow-emerald-900/30 min-h-[44px]"
              >
                {loadingStep === 'canvas' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    프로젝트 한 판 생성 중...
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4" />
                    프로젝트 한 판 생성 (명세+시안+플로우)
                  </>
                )}
              </button>
            </section>
          )}

          {/* Pencil Philosophy Callout */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-normal space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-xs">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              Liner Pencil 철학
            </div>
            <p>
              &quot;화면 하나를 만드는 AI보다, 기획 명세·다양한 상태의 시안·플로우가 연결된 <strong>프로젝트 한 판</strong>을 만드는 것이 팀의 제품 속도를 좌우합니다.&quot;
            </p>
          </div>
        </div>

        {/* Right Side: The Project Canvas ("프로젝트 한 판") (Col 8) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          
          {canvas ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-xl animate-in fade-in duration-300">
              
              {/* Canvas Header & Tabs */}
              <div className="p-4 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">PROJECT CANVAS</span>
                    <h2 className="text-sm font-semibold text-white">{canvas.title}</h2>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    명세(Spec) + 시안(Screens) + 플로우(Flows) 통합 한 판 뷰
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Canvas Tabs */}
                  <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                    <button
                      onClick={() => setActiveCanvasTab('screens')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                        activeCanvasTab === 'screens' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Layout className="w-3.5 h-3.5" />
                      시안 ({canvas.screens.length})
                    </button>
                    <button
                      onClick={() => setActiveCanvasTab('spec')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                        activeCanvasTab === 'spec' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      명세 (PRD)
                    </button>
                    <button
                      onClick={() => setActiveCanvasTab('flows')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                        activeCanvasTab === 'flows' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      플로우 ({canvas.flows.length})
                    </button>
                  </div>

                  {/* Export Buttons */}
                  <button
                    onClick={handleExportFigma}
                    title="Figma Schema JSON 복사"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-xs text-slate-200 border border-slate-700/80 transition min-h-[36px]"
                  >
                    {copiedFigma ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5 text-indigo-400" />}
                    <span>Figma 연동</span>
                  </button>

                  <button
                    onClick={handleCopyMarkdown}
                    title="PRD 마크다운 복사"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-xs text-slate-200 border border-slate-700/80 transition min-h-[36px]"
                  >
                    {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>PRD 복사</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Screens Matrix (시안들 나란히 펼쳐보기) */}
              {activeCanvasTab === 'screens' && (
                <div className="p-6 overflow-x-auto bg-slate-950/70">
                  <div className="flex gap-5 min-w-[900px] pb-3">
                    {canvas.screens.map((screen) => (
                      <div 
                        key={screen.id} 
                        className="flex-1 min-w-[280px] max-w-[320px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-lg hover:border-slate-700 transition"
                      >
                        {/* Screen Card Title Bar */}
                        <div className="p-3 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="font-semibold text-xs text-slate-200">{screen.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                              {screen.stateType}
                            </span>
                            <button
                              onClick={() => setInspectScreen(screen)}
                              className="p-1 rounded text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
                              title="화면 확대 인스펙트"
                              aria-label="화면 확대"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Interactive UI Mockup Preview */}
                        <div className="p-4 bg-slate-950/90 flex-1 flex flex-col gap-3 min-h-[360px]">
                          {/* Mock App Header */}
                          <div className="h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between px-3">
                            <span className="font-bold text-[11px] text-emerald-400">LINER AI</span>
                            <div className="flex gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                            </div>
                          </div>

                          {/* Dynamic Content based on State */}
                          {screen.stateType === 'default' && (
                            <div className="flex flex-col gap-2.5 flex-1 justify-center">
                              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-left">
                                <span className="text-[10px] text-emerald-400 font-semibold block mb-1">💡 추천 질문 클러스터</span>
                                <p className="text-xs text-slate-200 font-medium">
                                  &quot;최신 AI 모델 벤치마크 비교와 비용 효율성 요약해줘&quot;
                                </p>
                                <div className="mt-2 flex gap-1.5">
                                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">#검색 최적화</span>
                                  <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">#원클릭 요약</span>
                                </div>
                              </div>
                              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                                <span>1분 퀵 서머리 모드 활성화</span>
                                <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-400/50"></span>
                              </div>
                            </div>
                          )}

                          {screen.stateType === 'active' && (
                            <div className="flex flex-col gap-2 flex-1 justify-center">
                              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/40">
                                <span className="text-[10px] text-indigo-400 font-semibold block mb-1">⚡ 선택된 가설 프리뷰</span>
                                <p className="text-xs text-slate-100 font-medium">
                                  관련 논문 4건 및 기술 블로그 8건 실시간 파싱 준비 완료
                                </p>
                                <div className="mt-3 flex gap-2">
                                  <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] py-1.5 rounded-lg transition-colors">
                                    탐색 실행
                                  </button>
                                  <button className="px-2.5 bg-slate-800 text-slate-300 text-[11px] py-1.5 rounded-lg">
                                    닫기
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {screen.stateType === 'loading' && (
                            <div className="flex flex-col gap-3 flex-1 justify-center items-center text-center p-3">
                              <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin flex items-center justify-center"></div>
                              <div>
                                <p className="text-xs font-semibold text-slate-200">AI 에이전트 탐색 중...</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">가설에 적합한 데이터셋을 조합하고 있습니다 (0.6s)</p>
                              </div>
                              <div className="w-full space-y-1.5 mt-2">
                                <div className="h-2 rounded bg-slate-800 animate-pulse"></div>
                                <div className="h-2 w-4/5 rounded bg-slate-800 animate-pulse"></div>
                              </div>
                            </div>
                          )}

                          {screen.stateType === 'error' && (
                            <div className="flex flex-col gap-2.5 flex-1 justify-center text-center p-2">
                              <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                                <AlertCircle className="w-4 h-4" />
                              </div>
                              <p className="text-xs font-semibold text-slate-200">일시적 네트워크 지연</p>
                              <p className="text-[10px] text-slate-400">
                                캐시된 이전 검색 결과를 대신 표시하거나 다시 시도할 수 있습니다.
                              </p>
                              <button className="mt-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] py-1.5 rounded-lg border border-slate-700">
                                캐시 결과 열기
                              </button>
                            </div>
                          )}

                          {/* Components Specs Breakdown */}
                          <div className="mt-auto pt-2 border-t border-slate-800/80">
                            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                              포함 컴포넌트:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {screen.components.map((comp, cIdx) => (
                                <span key={cIdx} className="text-[9px] bg-slate-800/90 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700/50">
                                  {comp.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Screen Description Footer */}
                        <div className="p-2.5 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                          <span className="line-clamp-1">{screen.description}</span>
                          <button
                            onClick={() => setInspectScreen(screen)}
                            className="text-[10px] text-emerald-400 hover:underline shrink-0 ml-2"
                          >
                            상세
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Spec (명세 / PRD) */}
              {activeCanvasTab === 'spec' && (
                <div className="p-6 bg-slate-950/60 space-y-6 text-xs leading-relaxed max-h-[600px] overflow-y-auto">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 mb-2 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      1. 기획 개요 및 배경
                    </h3>
                    <p className="text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800">
                      {canvas.spec.overview}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-100 mb-2">2. 핵심 유저 스토리</h3>
                    <div className="space-y-1.5">
                      {canvas.spec.userStories.map((story, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          <span className="text-slate-200">{story}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-100 mb-2">3. 기능 요구사항 명세 (FR)</h3>
                    <div className="border border-slate-800 rounded-xl overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-900 text-slate-400 text-[11px] border-b border-slate-800">
                          <tr>
                            <th className="p-2.5 w-16">우선순위</th>
                            <th className="p-2.5 w-44">기능 항목</th>
                            <th className="p-2.5">상세 동작 및 조건</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 bg-slate-950/80">
                          {canvas.spec.functionalRequirements.map((fr) => (
                            <tr key={fr.id}>
                              <td className="p-2.5">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  fr.priority === 'P0' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                                }`}>
                                  {fr.priority}
                                </span>
                              </td>
                              <td className="p-2.5 font-medium text-slate-200">{fr.feature}</td>
                              <td className="p-2.5 text-slate-400">{fr.behavior}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-100 mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      4. 통제해야 할 엣지 케이스 (Edge Cases)
                    </h3>
                    <div className="space-y-1.5">
                      {canvas.spec.edgeCases.map((ec, ecIdx) => (
                        <div key={ecIdx} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-300 flex items-start gap-2">
                          <span className="text-amber-400 font-bold shrink-0">⚠️</span>
                          <span>{ec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Flow (화면 간 연결 플로우) */}
              {activeCanvasTab === 'flows' && (
                <div className="p-6 bg-slate-950/60 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <GitBranch className="w-4 h-4 text-emerald-400" />
                      사용자 여정 및 화면 간 전이 조건 (Flows)
                    </h3>
                    <span className="text-[11px] text-slate-400">총 {canvas.flows.length}개의 전이 경로</span>
                  </div>

                  <div className="space-y-2.5">
                    {canvas.flows.map((flow) => (
                      <div 
                        key={flow.id} 
                        className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs hover:border-slate-700 transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                            {flow.fromScreenId}
                          </span>
                          <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                            {flow.toScreenId}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-slate-200 font-medium block">
                            {flow.triggerAction}
                          </span>
                          {flow.condition && (
                            <span className="text-[10px] text-slate-500">
                              조건: {flow.condition}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Micro-Adjustment Prompt Bar ("마치 내 손처럼 쓰는 AI") */}
              <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                    프로젝트 한 판 미세 수정 (Micro-Iteration)
                  </span>
                  <span className="text-[10px] text-slate-400">자연어로 명세·시안·플로우를 즉각 변경</span>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '모바일 하단 탭바로 일괄 교체해줘',
                    '다크 모드 디자인 토큰 적용해줘',
                    '네트워크 실패 시 재시도 엣지 케이스 추가해줘'
                  ].map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => handleMicroEdit(preset)}
                      className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-800 hover:border-emerald-500/40 transition-colors"
                    >
                      ⚡ {preset}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={microPrompt}
                    onChange={(e) => setMicroPrompt(e.target.value)}
                    placeholder="예: '로그인 만료 엣지 케이스 추가해줘', '카드 배경을 강조색으로 바꿔줘'..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleMicroEdit();
                    }}
                  />
                  <button
                    onClick={() => handleMicroEdit()}
                    disabled={loadingStep === 'micro-edit' || !microPrompt.trim()}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    반영
                  </button>
                </div>

                {/* Edit History Log */}
                {microEditHistory.length > 0 && (
                  <div className="mt-1 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60 text-[10px] text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-3 h-3" />
                    <span>{microEditHistory[0]}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[460px] bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700 text-slate-400 flex items-center justify-center mb-4 shadow-xl">
                <Layers className="w-7 h-7 text-emerald-400/80" />
              </div>
              <h3 className="font-semibold text-sm text-slate-200">프로젝트 한 판(Canvas) 대기 중</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1.5 mb-5 leading-relaxed">
                좌측에서 신호를 입력하고 가설을 샤프닝한 후, 한 판 생성 버튼을 누르면 기획 명세, 상태별 시안, 사용자 플로우가 하나의 캔버스에 펼쳐집니다.
              </p>
              <button
                onClick={() => handleSharpen()}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                기본 예시로 샤프닝 시작
              </button>
            </div>
          )}

          {/* 5. Lessons-Learned Flywheel Section (루프를 닫고 다음 가설로 연결) */}
          {canvas && (
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-semibold text-sm text-slate-200">5. 지표 검증 &amp; 레슨런 플라이휠 (Lessons-Learned)</h3>
                </div>
                <button
                  onClick={handleExtractLessons}
                  disabled={loadingStep === 'flywheel'}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white text-xs font-medium px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-indigo-950 min-h-[38px]"
                >
                  {loadingStep === 'flywheel' ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <TrendingUp className="w-3.5 h-3.5" />
                  )}
                  실험 결과 검증 &amp; 레슨런 도출
                </button>
              </div>

              {lessons ? (
                <div className="space-y-4">
                  {/* Results Banner */}
                  <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-indigo-400 uppercase font-bold block">실험 결과 판정</span>
                      <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        가설 검증 성공 ({lessons.actualResult})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">대조군 대비 증감</span>
                      <span className="text-sm font-bold text-emerald-400">{lessons.delta}</span>
                    </div>
                  </div>

                  {/* Key Insights & What worked / failed */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1.5">
                        🎯 성공 요인 (What Worked)
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                        {lessons.whatWorked.map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-bold text-rose-400 uppercase block mb-1.5">
                        ⚠️ 한계 및 개선점 (What Failed)
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                        {lessons.whatFailed.map((f, idx) => (
                          <li key={idx}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Infinite Loop: Next Hypotheses Generation */}
                  <div className="pt-3 border-t border-slate-800">
                    <span className="text-xs font-semibold text-slate-300 block mb-2.5 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                      레슨런 기반 후속 가설 후보 (클릭 시 다음 루프로 즉각 진입):
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {lessons.nextHypotheses.map((nextHypo, nIdx) => (
                        <button
                          key={nIdx}
                          onClick={() => handleStartNextCycle(nextHypo.title)}
                          className="text-left bg-slate-950 hover:bg-slate-850 p-3.5 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-all group flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-[10px] text-emerald-400 font-semibold block mb-1">
                              NEXT CYCLE #{cycle + 1}
                            </span>
                            <p className="text-xs font-medium text-slate-200 group-hover:text-emerald-300 line-clamp-2">
                              {nextHypo.title}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                              {nextHypo.rationale}
                            </p>
                          </div>
                          <div className="mt-3 flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                            루프 시작 <CornerDownRight className="w-3 h-3" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 leading-relaxed">
                  실험 배포 후 결과를 수집하고 버튼을 누르면, 가설 대비 실측 지표 분석과 함께 <strong>멈추지 않고 다음 실험으로 이어지는 3가지 가설</strong>이 자동 발굴됩니다.
                </p>
              )}
            </section>
          )}

        </div>
      </main>

      {/* External Access / Live Share Guide Modal */}
      <ExternalShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Screen Detail Inspector Modal */}
      <ScreenDetailModal
        screen={inspectScreen}
        onClose={() => setInspectScreen(null)}
      />
    </div>
  );
}
