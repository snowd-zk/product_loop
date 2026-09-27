'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  AlertCircle, 
  TrendingUp, 
  Send,
  Zap,
  Target,
  ShieldCheck,
  ChevronRight,
  Eye,
  ChevronDown,
  Monitor,
  Mic,
  Maximize2,
  Minimize2,
  Users,
  Briefcase,
  Code,
  HeartHandshake,
  Check,
  X,
  Play,
  Globe
} from 'lucide-react';
import { 
  PresentationLoopPhase,
  PresentationSignal,
  SharpenedPyramid,
  PresentationCanvas,
  SlideItem,
  RehearsalSimulation,
  PresentationFlywheel,
  MECETreeNode
} from '@/types/presentation-loop';
import { pptxExporter } from '@/lib/agents/pptx-exporter';
import ExternalShareModal from '@/components/ExternalShareModal';

// 프리셋 신호 목록
const SAMPLE_SIGNALS = [
  {
    title: 'Product Loop 전사 도입 및 리드타임 80% 단축 제안',
    content: 'Liner Pencil 기반 무한 프로덕트 루프를 도입하여 스프린트 기획-디자인 병목 시간을 11.4일에서 2.5일로 단축하고, 연간 2.4억원 상당의 엔지니어링 낭비를 제거하기 위한 C-Level 승인 덱',
    audience: 'C-Level 경영진(CEO/CFO/CTO)',
    time: 15
  },
  {
    title: 'AI 개인화 추천 엔진 도입 및 전환율(CVR) 2.5배 개선안',
    content: '검색 결과 및 홈 피드에 인텔리전트 맥락 카드를 적용하여 첫 방문 유저의 이탈을 방지하고 유료 플랜 전환율을 2.4%에서 6.0%로 끌어올리는 프로덕트 싱크 덱',
    audience: '프로덕트 리더십 및 그로스 스쿼드',
    time: 10
  },
  {
    title: '디자인 시스템 토큰 자동화 및 Figma-코드 동기화 파이프라인',
    content: '디자인 시스템 토큰을 단일 진실 공급원(SSOT)으로 통합하고 Figma 양방향 동기화를 자동화하여 디자이너-개발자 간 핸드오프 오버헤드를 제로화하는 엔지니어링 기술 제안',
    audience: '디자인 총괄 및 테크 리더십',
    time: 12
  }
];

export default function PresentationLoopPage() {
  const [cycle, setCycle] = useState(1);
  const [currentPhase, setCurrentPhase] = useState<PresentationLoopPhase>('signal');
  const [loadingStep, setLoadingStep] = useState<string | null>(null);

  // Phase 1: Input Signals
  const [rawTitle, setRawTitle] = useState(SAMPLE_SIGNALS[0].title);
  const [rawContent, setRawContent] = useState(SAMPLE_SIGNALS[0].content);
  const [targetAudience, setTargetAudience] = useState(SAMPLE_SIGNALS[0].audience);
  const [timeLimit, setTimeLimit] = useState(SAMPLE_SIGNALS[0].time);

  // States
  const [signal, setSignal] = useState<PresentationSignal | null>(null);
  const [pyramid, setPyramid] = useState<SharpenedPyramid | null>(null);
  const [canvas, setCanvas] = useState<PresentationCanvas | null>(null);
  const [activeCanvasTab, setActiveCanvasTab] = useState<'tree' | 'grid' | 'slide_detail'>('tree');
  const [selectedSlideId, setSelectedSlideId] = useState<string>('slide-1-cover');
  const [microPrompt, setMicroPrompt] = useState('');
  const [microHistory, setMicroHistory] = useState<string[]>([]);
  const [rehearsal, setRehearsal] = useState<RehearsalSimulation | null>(null);
  const [flywheel, setFlywheel] = useState<PresentationFlywheel | null>(null);

  // Full-screen Presentation Modal
  const [isSlideShowOpen, setIsSlideShowOpen] = useState(false);
  const [slideShowIndex, setSlideShowIndex] = useState(0);
  const [showPresenterNotes, setShowPresenterNotes] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Keyboard navigation for slide show
  useEffect(() => {
    if (!isSlideShowOpen || !canvas) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setSlideShowIndex((prev) => Math.min(prev + 1, canvas.slides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setSlideShowIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        setIsSlideShowOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSlideShowOpen, canvas]);

  // 1. Pyramid Sharpening
  const handleSharpen = async () => {
    setLoadingStep('sharpen');
    try {
      const res = await fetch('/api/presentation/sharpen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: rawTitle,
          rawContent,
          targetAudienceHint: targetAudience,
          timeLimitMinutes: timeLimit
        })
      });
      const data = await res.json();
      if (data.success) {
        setSignal(data.signal);
        setPyramid(data.pyramid);
        setCurrentPhase('sharpening');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStep(null);
    }
  };

  // 2. Generate Presentation Canvas
  const handleGenerateCanvas = async () => {
    if (!pyramid) return;
    setLoadingStep('canvas');
    try {
      const res = await fetch('/api/presentation/canvas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pyramid })
      });
      const data = await res.json();
      if (data.success) {
        setCanvas(data.canvas);
        setCurrentPhase('canvas');
        setActiveCanvasTab('tree');
        if (data.canvas.slides.length > 0) {
          setSelectedSlideId(data.canvas.slides[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStep(null);
    }
  };

  // 3. Micro Edit
  const handleMicroEdit = async (customPrompt?: string) => {
    const cmd = customPrompt || microPrompt;
    if (!cmd.trim() || !canvas) return;
    setLoadingStep('micro_edit');
    try {
      const res = await fetch('/api/presentation/micro-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canvas, command: cmd })
      });
      const data = await res.json();
      if (data.success) {
        setCanvas(data.canvas);
        setMicroHistory((prev) => [data.message, ...prev]);
        setMicroPrompt('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStep(null);
    }
  };

  // 4. Run Simulated Audience Rehearsal
  const handleRunRehearsal = async () => {
    if (!canvas) return;
    setLoadingStep('rehearsal');
    try {
      const res = await fetch('/api/presentation/rehearse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canvas })
      });
      const data = await res.json();
      if (data.success) {
        setRehearsal(data.rehearsal);
        setCurrentPhase('rehearsal');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStep(null);
    }
  };

  // 5. Run Lessons-Learned Flywheel
  const handleRunFlywheel = async () => {
    if (!canvas || !rehearsal) return;
    setLoadingStep('flywheel');
    try {
      const res = await fetch('/api/presentation/flywheel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canvas, rehearsal, cycle })
      });
      const data = await res.json();
      if (data.success) {
        setFlywheel(data.flywheel);
        setCanvas(data.updatedCanvas);
        setCurrentPhase('flywheel');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStep(null);
    }
  };

  // 6. Enter Next Cycle with reinforced deck
  const handleNextCycle = () => {
    setCycle((prev) => prev + 1);
    setCurrentPhase('canvas');
    setActiveCanvasTab('grid');
    setRehearsal(null);
  };

  // 7. Download PPTX
  const handleDownloadPPTX = async () => {
    if (!canvas) return;
    try {
      await pptxExporter.downloadInBrowser(canvas);
    } catch (err) {
      console.error('PPTX export error:', err);
      alert('PPTX 다운로드 중 오류가 발생했습니다.');
    }
  };

  const selectedSlide = canvas?.slides.find((s) => s.id === selectedSlideId) || canvas?.slides[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
                Presentation Loop
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
                  MECE & AI Rehearsal
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              맥킨지 피라미드 샤프닝 & AI 모의 청중 리허설 기반 무한 설득 루프 시스템
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Cycle Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
            <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
            <span>Cycle #{cycle}</span>
          </div>

          {/* External Access / Live Share Guide Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition"
            title="외부 모바일 및 동료 접속 가이드"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">외부 접속 &amp; 공유</span>
          </button>

          {/* Switch to Product Loop */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Product Loop 이동</span>
          </Link>

          {/* Export Actions (Active if Canvas exists) */}
          {canvas && (
            <>
              <button
                onClick={handleDownloadPPTX}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PPTX 다운로드</span>
              </button>

              <button
                onClick={() => {
                  setSlideShowIndex(0);
                  setIsSlideShowOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-600/20 transition"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>발표 모드</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* 5-Phase Interactive Stepper */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 px-6 py-2.5 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[760px] max-w-6xl mx-auto text-xs">
          {[
            { phase: 'signal', label: '1. 신호 인제스천', icon: Zap },
            { phase: 'sharpening', label: '2. MECE 피라미드 샤프닝', icon: Target },
            { phase: 'canvas', label: '3. 발표 한 판 (Canvas)', icon: Layout },
            { phase: 'rehearsal', label: '4. AI 모의 청중 리허설', icon: Users },
            { phase: 'flywheel', label: '5. 설득 플라이휠 (Cycle #N+1)', icon: RefreshCw }
          ].map((item, idx) => {
            const isActive = currentPhase === item.phase;
            const isCompleted =
              (item.phase === 'signal' && pyramid) ||
              (item.phase === 'sharpening' && canvas) ||
              (item.phase === 'canvas' && rehearsal) ||
              (item.phase === 'rehearsal' && flywheel);
            const Icon = item.icon;

            return (
              <React.Fragment key={item.phase}>
                <button
                  onClick={() => {
                    if (isCompleted || isActive) {
                      setCurrentPhase(item.phase as PresentationLoopPhase);
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold'
                      : isCompleted
                      ? 'text-slate-300 hover:bg-slate-800/50 cursor-pointer'
                      : 'text-slate-500 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : isCompleted ? 'text-emerald-400' : ''}`} />
                  <span>{item.label}</span>
                  {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400 ml-0.5" />}
                </button>
                {idx < 4 && <ChevronRight className="w-3.5 h-3.5 text-slate-700 shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* ============================================================== */}
        {/* PHASE 1: Signal Ingestion */}
        {/* ============================================================== */}
        {currentPhase === 'signal' && (
          <section className="space-y-6 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">1단계: 발표 원천 신호(Signal) 인제스천</h2>
                    <p className="text-xs text-slate-400">
                      Product Loop 산출물이나 비즈니스 제안 원문을 바탕으로 설득 목적과 청중을 설정합니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">샘플 프리셋:</span>
                  {SAMPLE_SIGNALS.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setRawTitle(s.title);
                        setRawContent(s.content);
                        setTargetAudience(s.audience);
                        setTimeLimit(s.time);
                      }}
                      className="px-2.5 py-1 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                    >
                      프리셋 #{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                    <span>발표 주제 및 핵심 목표 (Title)</span>
                  </label>
                  <input
                    type="text"
                    value={rawTitle}
                    onChange={(e) => setRawTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition"
                    placeholder="예: Product Loop 전사 도입 및 리드타임 80% 단축 제안"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">목표 청중 페르소나 (Target Audience)</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition"
                    placeholder="예: C-Level 경영진(CEO/CFO/CTO)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">
                  원천 맥락 및 세부 근거 (Product Loop 산출물 / 전략 메모)
                </label>
                <textarea
                  value={rawContent}
                  onChange={(e) => setRawContent(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition resize-none leading-relaxed"
                  placeholder="발표의 배경, 해결하고자 하는 결핍, 기대 임팩트, 실측치 등을 자유롭게 작성하세요."
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>발표 제한 시간:</span>
                  <div className="flex items-center gap-1.5">
                    {[10, 15, 25].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => setTimeLimit(mins)}
                        className={`px-2.5 py-1 rounded-md text-xs transition ${
                          timeLimit === mins
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {mins}분
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSharpen}
                  disabled={loadingStep === 'sharpen'}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition disabled:opacity-50"
                >
                  {loadingStep === 'sharpen' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>피라미드 샤프닝 중...</span>
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4" />
                      <span>피라미드 샤프닝 시작</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* PHASE 2: Pyramid Sharpening View */}
        {/* ============================================================== */}
        {currentPhase === 'sharpening' && pyramid && (
          <section className="space-y-6 animate-fadeIn">
            {/* Top Governing Thought Card */}
            <div className="bg-gradient-to-br from-blue-900/30 via-slate-900 to-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  <Target className="w-4 h-4" />
                  <span>Governing Thought (단 하나의 정점 결론)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                    타깃: {pyramid.targetAudience.role}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                    권장 시간: {pyramid.presentationConstraints.targetDurationMinutes}분
                  </span>
                </div>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">
                {pyramid.governingThought}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 block mb-1 font-medium">청중의 최우선 관심사:</span>
                  <span className="text-slate-200">{pyramid.targetAudience.primaryInterest}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-rose-400 block mb-1 font-medium">사전 예상되는 최대 의구심(Objection):</span>
                  <span className="text-slate-200">{pyramid.targetAudience.expectedObjection}</span>
                </div>
              </div>
            </div>

            {/* 3 MECE Logic Pillars Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {pyramid.pillars.map((pillar, idx) => {
                const colors = [
                  { border: 'border-rose-500/30', badge: 'bg-rose-500/10 text-rose-400', tag: 'WHY NOW' },
                  { border: 'border-emerald-500/30', badge: 'bg-emerald-500/10 text-emerald-400', tag: 'HOW IT WORKS' },
                  { border: 'border-purple-500/30', badge: 'bg-purple-500/10 text-purple-400', tag: 'IMPACT & ROI' }
                ][idx];

                return (
                  <div
                    key={pillar.id}
                    className={`bg-slate-900 border ${colors.border} rounded-2xl p-5 flex flex-col justify-between shadow-lg space-y-4`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                          {colors.tag}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">Pillar #{idx + 1}</span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-100 leading-snug">{pillar.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                        {pillar.keyArgument}
                      </p>

                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-semibold text-slate-400 block">세부 MECE 논거:</span>
                        {pillar.subArguments.map((sub, sIdx) => (
                          <div key={sIdx} className="text-xs text-slate-300 flex items-start gap-1.5">
                            <span className="text-blue-400">•</span>
                            <span className="leading-tight">{sub}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Evidence Data Cards */}
                    <div className="border-t border-slate-800 pt-3 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Fact & Evidence Backing:
                      </span>
                      {pillar.evidenceData.map((ev, eIdx) => (
                        <div key={eIdx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                          <div className="text-slate-400 text-[11px] truncate">{ev.metricName}</div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-slate-500 text-[10px]">기준: {ev.baselineValue}</span>
                            <span className="text-emerald-400 font-semibold">{ev.projectedValue}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <button
                onClick={() => setCurrentPhase('signal')}
                className="text-xs text-slate-400 hover:text-slate-200 transition"
              >
                ← 이전 입력 수정
              </button>

              <button
                onClick={handleGenerateCanvas}
                disabled={loadingStep === 'canvas'}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition disabled:opacity-50"
              >
                {loadingStep === 'canvas' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>발표 한 판 빌드 중...</span>
                  </>
                ) : (
                  <>
                    <Layout className="w-4 h-4" />
                    <span>발표 한 판(Canvas) 생성하기</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* PHASE 3: Presentation Canvas ("발표 한 판") */}
        {/* ============================================================== */}
        {(currentPhase === 'canvas' || currentPhase === 'rehearsal' || currentPhase === 'flywheel') && canvas && (
          <section className="space-y-6 animate-fadeIn">
            {/* Canvas Header & View Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Layout className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    Presentation Canvas ("발표 한 판")
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      {canvas.slides.length} Slides
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    전체 논리 구조 트리와 슬라이드 썸네일, 발표자 스크립트를 통합 조망합니다.
                  </p>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveCanvasTab('tree')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                    activeCanvasTab === 'tree'
                      ? 'bg-blue-600 text-white font-semibold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>MECE 트리 뷰</span>
                </button>
                <button
                  onClick={() => setActiveCanvasTab('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                    activeCanvasTab === 'grid'
                      ? 'bg-blue-600 text-white font-semibold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>슬라이드 한 판 그리드</span>
                </button>
                <button
                  onClick={() => setActiveCanvasTab('slide_detail')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                    activeCanvasTab === 'slide_detail'
                      ? 'bg-blue-600 text-white font-semibold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>슬라이드 상세 & 스크립트</span>
                </button>
              </div>
            </div>

            {/* TAB 1: MECE 트리 뷰 */}
            {activeCanvasTab === 'tree' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <GitBranch className="w-4 h-4 text-blue-400" />
                    <span>맥킨지 피라미드 계층형 MECE 논리 트리 (노드를 클릭하면 해당 슬라이드로 이동합니다)</span>
                  </div>
                </div>

                {/* Tree Visualization */}
                <div className="space-y-4 pt-2">
                  {/* Root Node */}
                  <div
                    onClick={() => {
                      setSelectedSlideId('slide-1-cover');
                      setActiveCanvasTab('slide_detail');
                    }}
                    className="p-4 rounded-xl bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-blue-500/40 hover:border-blue-400 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500 text-white">
                        LEVEL 0: GOVERNING THOUGHT
                      </span>
                      <span className="text-xs text-blue-300 hover:underline flex items-center gap-1">
                        Slide #1 프리뷰 <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-bold text-white">{canvas.mindmapTree.label}</p>
                  </div>

                  {/* Level 1 Nodes (Pillars) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pl-4 border-l-2 border-slate-800">
                    {canvas.mindmapTree.children.map((child, idx) => (
                      <div
                        key={child.id}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              LEVEL 1: BRANCH #{idx + 1}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-200 leading-snug">{child.label}</h4>
                        </div>

                        {/* Child Slides */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                          {child.children.length > 0 ? (
                            child.children.map((grand) => (
                              <button
                                key={grand.id}
                                onClick={() => {
                                  if (grand.slideRefId) {
                                    setSelectedSlideId(grand.slideRefId);
                                    setActiveCanvasTab('slide_detail');
                                  }
                                }}
                                className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-blue-600/20 text-[11px] text-slate-300 hover:text-blue-300 border border-slate-800/50 transition flex items-center justify-between"
                              >
                                <span className="truncate">{grand.label}</span>
                                <ChevronRight className="w-3 h-3 shrink-0 ml-1" />
                              </button>
                            ))
                          ) : (
                            <button
                              onClick={() => {
                                if (child.slideRefId) {
                                  setSelectedSlideId(child.slideRefId);
                                  setActiveCanvasTab('slide_detail');
                                }
                              }}
                              className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-blue-600/20 text-[11px] text-slate-300 hover:text-blue-300 border border-slate-800/50 transition flex items-center justify-between"
                            >
                              <span>슬라이드 바로보기</span>
                              <ChevronRight className="w-3 h-3 shrink-0 ml-1" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: 슬라이드 한 판 그리드 (Card Grid) */}
            {activeCanvasTab === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {canvas.slides.map((slide) => {
                  const isSelected = selectedSlide?.id === slide.id;
                  const isVulnerable = rehearsal?.vulnerableSlideIds?.includes(slide.id);

                  return (
                    <div
                      key={slide.id}
                      onClick={() => {
                        setSelectedSlideId(slide.id);
                        setActiveCanvasTab('slide_detail');
                      }}
                      className={`group rounded-xl border p-4 transition cursor-pointer flex flex-col justify-between h-56 relative ${
                        isSelected
                          ? 'bg-blue-950/30 border-blue-500 shadow-lg shadow-blue-500/10'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                          style={{ backgroundColor: slide.visualTokens.accentColor || '#3B82F6' }}
                        >
                          {slide.visualTokens.badgeText || `SLIDE ${slide.slideNumber}`}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {isVulnerable && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30">
                              취약점
                            </span>
                          )}
                          <span className="text-[11px] font-mono text-slate-500">#{slide.slideNumber}</span>
                        </div>
                      </div>

                      {/* Head Message */}
                      <div className="my-auto">
                        <h4 className="text-xs font-bold text-slate-100 line-clamp-3 leading-snug">
                          {slide.headMessage}
                        </h4>
                        {slide.subTitle && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{slide.subTitle}</p>
                        )}
                      </div>

                      {/* Bottom Footer Info */}
                      <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Mic className="w-3 h-3 text-slate-500" />
                          {slide.speakerNotes.estimatedSeconds}s
                        </span>
                        <span className="text-blue-400 group-hover:underline flex items-center gap-0.5">
                          자세히 <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 3: 슬라이드 상세 & 스피킹 노트 (Slide Detail Inspector) */}
            {activeCanvasTab === 'slide_detail' && selectedSlide && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 16:9 Slide Preview Canvas (2 Cols) */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 min-h-[460px] flex flex-col justify-between relative overflow-hidden">
                    {/* Top Slide Header */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-md text-white shadow-sm"
                          style={{ backgroundColor: selectedSlide.visualTokens.accentColor || '#2563EB' }}
                        >
                          {selectedSlide.visualTokens.badgeText || `SLIDE ${selectedSlide.slideNumber}`}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">
                            레이아웃: <code className="text-slate-200">{selectedSlide.layoutType}</code>
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
                        {selectedSlide.headMessage}
                      </h3>
                      {selectedSlide.subTitle && (
                        <p className="text-xs text-slate-400 mt-1">{selectedSlide.subTitle}</p>
                      )}
                    </div>

                    {/* Middle Dynamic Components Preview */}
                    <div className="my-auto py-4">
                      {selectedSlide.components.map((comp) => {
                        if (comp.type === 'metric_card') {
                          const mData = comp.data as Record<string, string>;
                          return (
                            <div
                              key={comp.id}
                              className="p-5 rounded-xl bg-slate-950 border border-blue-500/30 shadow-inner flex items-center justify-between"
                            >
                              <div>
                                <span className="text-xs font-semibold text-slate-400 block">{comp.title}</span>
                                <div className="text-2xl font-black text-blue-400 mt-1">
                                  {mData.metric || mData.target || 'N/A'}
                                </div>
                              </div>
                              {mData.baseline && (
                                <div className="text-right text-xs text-slate-500">
                                  <span>기존 기준선:</span>
                                  <div className="text-slate-300 font-mono mt-0.5">{mData.baseline}</div>
                                </div>
                              )}
                            </div>
                          );
                        }

                        if (comp.type === 'column_grid') {
                          const colData = comp.data as { columns?: { title: string; desc: string; badge?: string }[] };
                          return (
                            <div key={comp.id} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {colData.columns?.map((col, idx) => (
                                <div
                                  key={idx}
                                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5"
                                >
                                  {col.badge && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-300">
                                      {col.badge}
                                    </span>
                                  )}
                                  <h4 className="font-bold text-slate-200">{col.title}</h4>
                                  <p className="text-[11px] text-slate-400 leading-relaxed">{col.desc}</p>
                                </div>
                              ))}
                            </div>
                          );
                        }

                        if (comp.type === 'comparison_table') {
                          const cData = comp.data as {
                            leftTitle: string;
                            leftItems: string[];
                            rightTitle: string;
                            rightItems: string[];
                          };
                          return (
                            <div key={comp.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/20 space-y-2">
                                <span className="text-rose-400 font-bold block">{cData.leftTitle}</span>
                                <ul className="space-y-1 text-slate-400">
                                  {cData.leftItems.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5">
                                      <span className="text-rose-500">✕</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/20 space-y-2">
                                <span className="text-emerald-400 font-bold block">{cData.rightTitle}</span>
                                <ul className="space-y-1 text-slate-300">
                                  {cData.rightItems.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5">
                                      <span className="text-emerald-400">✓</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          );
                        }

                        if (comp.type === 'diagram') {
                          const dData = comp.data as { steps?: { step: string; desc: string }[] };
                          return (
                            <div key={comp.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                              <span className="text-xs font-bold text-slate-300">{comp.title}</span>
                              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs">
                                {dData.steps?.map((st, idx) => (
                                  <div
                                    key={idx}
                                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px]"
                                  >
                                    <div className="font-bold text-blue-400">{st.step}</div>
                                    <div className="text-slate-400 mt-0.5 line-clamp-2">{st.desc}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        return null;
                      })}
                    </div>

                    {/* Bottom Nav Controller */}
                    <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
                      <button
                        onClick={() => {
                          const currentIdx = canvas.slides.findIndex((s) => s.id === selectedSlide.id);
                          if (currentIdx > 0) {
                            setSelectedSlideId(canvas.slides[currentIdx - 1].id);
                          }
                        }}
                        disabled={canvas.slides[0].id === selectedSlide.id}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 transition"
                      >
                        ← 이전 슬라이드
                      </button>

                      <span className="text-slate-500 font-mono">
                        {canvas.slides.findIndex((s) => s.id === selectedSlide.id) + 1} / {canvas.slides.length}
                      </span>

                      <button
                        onClick={() => {
                          const currentIdx = canvas.slides.findIndex((s) => s.id === selectedSlide.id);
                          if (currentIdx < canvas.slides.length - 1) {
                            setSelectedSlideId(canvas.slides[currentIdx + 1].id);
                          }
                        }}
                        disabled={canvas.slides[canvas.slides.length - 1].id === selectedSlide.id}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 transition"
                      >
                        다음 슬라이드 →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Speaker Notes & Logic Bridge Panel (1 Col) */}
                <div className="space-y-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                        <Mic className="w-4 h-4 text-emerald-400" />
                        <span>발표자 스피킹 노트 (Speaker Notes)</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                        {selectedSlide.speakerNotes.estimatedSeconds}s
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                        구두 발화 스크립트:
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-sans">
                        "{selectedSlide.speakerNotes.script}"
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <span className="text-[11px] font-semibold text-blue-400 block uppercase tracking-wider flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" />
                        So What? 논리 브릿지 (다음 장표 연결):
                      </span>
                      <p className="text-xs text-slate-300 bg-blue-950/20 border border-blue-500/20 p-3 rounded-xl italic">
                        "{selectedSlide.speakerNotes.soWhatBridge}"
                      </p>
                    </div>
                  </div>

                  {/* Micro-Iteration Controller */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>손처럼 쓰는 미세 수정 (Micro-Iteration)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={microPrompt}
                        onChange={(e) => setMicroPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleMicroEdit()}
                        placeholder='예: "테마를 테크 인디고로 변경", "스피킹 노트 격식체로 수정"'
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={() => handleMicroEdit()}
                        disabled={loadingStep === 'micro_edit' || !microPrompt.trim()}
                        className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold disabled:opacity-40 transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[
                        '테마를 tech_indigo로 변경',
                        '스피킹 노트를 경영진 보고체로 수정',
                        '6번 슬라이드 ROI 지표 강조'
                      ].map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleMicroEdit(preset)}
                          className="text-[10px] px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition"
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>

                    {microHistory.length > 0 && (
                      <div className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg">
                        {microHistory[0]}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions: Move to Rehearsal */}
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">
                발표 한 판 검토 완료 • 총 {canvas.slides.length}개 슬라이드 정렬됨
              </span>

              <button
                onClick={handleRunRehearsal}
                disabled={loadingStep === 'rehearsal'}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-sm font-semibold shadow-lg shadow-rose-500/20 transition disabled:opacity-50"
              >
                {loadingStep === 'rehearsal' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI 모의 청중 리허설 진행 중...</span>
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    <span>AI 모의 청중 리허설 가동하기</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* PHASE 4: AI Simulated Audience Rehearsal */}
        {/* ============================================================== */}
        {(currentPhase === 'rehearsal' || currentPhase === 'flywheel') && rehearsal && (
          <section className="space-y-6 animate-fadeIn">
            {/* Rehearsal Score Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      4단계: AI 모의 청중(Simulated Audience) 리허설 결과
                    </h2>
                    <p className="text-xs text-slate-400">
                      깐깐한 CFO, 보수적 CTO, CPO 페르소나가 가상 Q&A 공격을 감행하고 방어율을 측정했습니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">종합 방어율 점수</span>
                    <div className="text-2xl font-black text-rose-400">{rehearsal.overallScore} / 100점</div>
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                      rehearsal.verdict === 'ready_to_present'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {rehearsal.verdict === 'ready_to_present' ? '발표 준비 완료' : '보완 필요 (Needs Reinforcement)'}
                  </div>
                </div>
              </div>

              {/* Objections List */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  모의 Q&A 공방 시뮬레이션 및 취약점 분석:
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {rehearsal.objections.map((obj) => (
                    <div
                      key={obj.id}
                      className={`p-4 rounded-xl border transition space-y-2.5 ${
                        obj.defenseStatus === 'defended'
                          ? 'bg-slate-950 border-emerald-500/30'
                          : 'bg-slate-950 border-rose-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              obj.personaType === 'skeptical_cfo'
                                ? 'bg-amber-500/20 text-amber-400'
                                : obj.personaType === 'technical_cto'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-purple-500/20 text-purple-400'
                            }`}
                          >
                            {obj.personaType.toUpperCase().replace('_', ' ')}
                          </span>
                          <span className="text-xs text-slate-400">타깃 장표: {obj.targetSlideId}</span>
                        </div>

                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            obj.defenseStatus === 'defended'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {obj.defenseStatus === 'defended' ? '✓ 방어 성공' : '⚠ 취약점 노출'}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-slate-100">" {obj.question} "</p>

                      <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <span className="font-semibold text-slate-300">개선 제안: </span>
                        {obj.improvementSuggestion}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action to Flywheel */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400">
                  발견된 취약점을 메우는 보강 장표를 자동으로 발행하여 다음 사이클로 순환합니다.
                </span>

                <button
                  onClick={handleRunFlywheel}
                  disabled={loadingStep === 'flywheel'}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-500/20 transition disabled:opacity-50"
                >
                  {loadingStep === 'flywheel' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>설득 플라이휠 가동 중...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>설득 플라이휠 가동 (Cycle #2 생성)</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* PHASE 5: Lessons-Learned Flywheel & Cycle #N+1 */}
        {/* ============================================================== */}
        {currentPhase === 'flywheel' && flywheel && (
          <section className="space-y-6 animate-fadeIn">
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <RefreshCw className="w-6 h-6 animate-spin-slow" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      5단계: 설득 레슨런 플라이휠 (Lessons-Learned Flywheel)
                    </h2>
                    <p className="text-xs text-slate-400">
                      리허설 분석을 반영하여 보완 장표(Appendix A, B)가 자동으로 삽입된 신규 덱이 완성되었습니다.
                    </p>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  Cycle #{flywheel.cycleNumber + 1} 덱 업데이트 완료
                </div>
              </div>

              {/* What Convinced vs What Failed */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Convinced */}
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20 space-y-3">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>What Convinced (설득에 성공한 지점)</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {flywheel.whatConvinced.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Failed / Vulnerable */}
                <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/20 space-y-3">
                  <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>What Failed (논리적 비약 및 공격받은 지점)</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {flywheel.whatFailed.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold">✕</span>
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Auto Applied Revisions */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-slate-200">
                  Cycle #{flywheel.cycleNumber + 1}에 자동 반영된 보완 사항:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {flywheel.nextDeckRevisions.map((rev, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
                        {rev.actionType}
                      </span>
                      <h5 className="font-semibold text-slate-200 mt-1">{rev.title}</h5>
                      <p className="text-[11px] text-slate-400">{rev.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions: Enter next cycle */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleDownloadPPTX}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  <Download className="w-4 h-4" />
                  <span>보강된 덱 PPTX로 내보내기</span>
                </button>

                <button
                  onClick={handleNextCycle}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Cycle #{cycle + 1} 발표 한 판으로 복귀</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ============================================================== */}
      {/* Full-screen Slide Show Modal */}
      {/* ============================================================== */}
      {isSlideShowOpen && canvas && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-6 animate-fadeIn">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-900 pb-3">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white text-sm">{canvas.title}</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {slideShowIndex + 1} / {canvas.slides.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPresenterNotes(!showPresenterNotes)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  showPresenterNotes ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>발표자 노트 {showPresenterNotes ? '숨기기' : '보기'}</span>
              </button>

              <button
                onClick={() => setIsSlideShowOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Slide Content Area */}
          <div className="flex-1 flex items-center justify-center py-6">
            <div className="w-full max-w-5xl aspect-video bg-slate-900 border border-slate-800 rounded-3xl p-10 flex flex-col justify-between shadow-2xl relative">
              {/* Badge & Meta */}
              <div>
                <span
                  className="text-xs font-bold px-3 py-1 rounded text-white"
                  style={{
                    backgroundColor: canvas.slides[slideShowIndex].visualTokens.accentColor || '#3B82F6'
                  }}
                >
                  {canvas.slides[slideShowIndex].visualTokens.badgeText || `SLIDE ${slideShowIndex + 1}`}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-4 leading-tight">
                  {canvas.slides[slideShowIndex].headMessage}
                </h2>
                {canvas.slides[slideShowIndex].subTitle && (
                  <p className="text-sm text-slate-400 mt-2">{canvas.slides[slideShowIndex].subTitle}</p>
                )}
              </div>

              {/* Slide Body Components */}
              <div className="my-auto py-6">
                {canvas.slides[slideShowIndex].components.map((c) => {
                  if (c.type === 'metric_card') {
                    const md = c.data as Record<string, string>;
                    return (
                      <div key={c.id} className="p-6 rounded-2xl bg-slate-950 border border-slate-800">
                        <span className="text-xs text-slate-400 font-semibold">{c.title}</span>
                        <div className="text-4xl font-black text-blue-400 mt-2">
                          {md.metric || md.target}
                        </div>
                      </div>
                    );
                  }
                  if (c.type === 'column_grid') {
                    const cd = c.data as { columns?: { title: string; desc: string; badge?: string }[] };
                    return (
                      <div key={c.id} className="grid grid-cols-3 gap-4">
                        {cd.columns?.map((col, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-400">
                              {col.badge}
                            </span>
                            <h4 className="font-bold text-slate-100 text-sm mt-2">{col.title}</h4>
                            <p className="text-xs text-slate-400 mt-1">{col.desc}</p>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Slide Footer */}
              <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80 pt-4">
                <span>Product Loop • Presentation Engineering</span>
                <span>방향키 (← / →) 로 슬라이드를 전환하세요</span>
              </div>
            </div>
          </div>

          {/* Presenter Notes Floating Drawer */}
          {showPresenterNotes && (
            <div className="bg-slate-900/90 border border-slate-800 backdrop-blur rounded-2xl p-4 max-w-4xl mx-auto w-full text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" />
                  발표 스피킹 스크립트:
                </span>
                <span>권장 {canvas.slides[slideShowIndex].speakerNotes.estimatedSeconds}초</span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed">
                "{canvas.slides[slideShowIndex].speakerNotes.script}"
              </p>
              <p className="text-blue-400 text-xs italic">
                So What? 브릿지: "{canvas.slides[slideShowIndex].speakerNotes.soWhatBridge}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* External Access / Live Share Guide Modal */}
      <ExternalShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}
