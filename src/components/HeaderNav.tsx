'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Layers, 
  Target, 
  RefreshCw, 
  Globe, 
  Menu, 
  X, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  Sliders,
  Presentation
} from 'lucide-react';

interface HeaderNavProps {
  activeApp: 'product' | 'presentation';
  cycle?: number;
  currentPhase?: string;
  onReset?: () => void;
  onOpenShareModal: () => void;
}

export default function HeaderNav({
  activeApp,
  cycle = 1,
  currentPhase = 'signal',
  onReset,
  onOpenShareModal
}: HeaderNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const productPhases = [
    { phase: 'signal', label: '1. 신호 & 가설' },
    { phase: 'sharpening', label: '2. 가설 샤프닝' },
    { phase: 'canvas', label: '3. 프로젝트 한 판' },
    { phase: 'execution_qa', label: '4. 검증 & QA' },
    { phase: 'evaluation', label: '5. 레슨런 플라이휠' }
  ];

  const presentationPhases = [
    { phase: 'signal', label: '1. 발표 목표 & 청중' },
    { phase: 'sharpening', label: '2. 피라미드 샤프닝' },
    { phase: 'canvas', label: '3. 12슬라이드 한 판' },
    { phase: 'rehearsal', label: '4. 가상 청중 리허설' },
    { phase: 'flywheel', label: '5. 레슨런 플라이휠' }
  ];

  const phases = activeApp === 'product' ? productPhases : presentationPhases;

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Branding & App Switcher */}
        <div className="flex items-center gap-3">
          <Link 
            href="/"
            className="flex items-center gap-2.5 group"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-lg transition-transform group-hover:scale-105 ${
              activeApp === 'product' 
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-950/50' 
                : 'bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-blue-950/50'
            }`}>
              {activeApp === 'product' ? 'P' : 'PL'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-white group-hover:text-emerald-300 transition">
                  Product Loop
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Pencil Model v1.0
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Cycle #{cycle}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                가설 샤프닝 → 기획·시안·플로우 &quot;한 판&quot; → 무한 루프 시스템
              </p>
            </div>
          </Link>

          {/* Navigation Pill Switcher */}
          <nav className="hidden md:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 ml-2" aria-label="메인 네비게이션">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeApp === 'product'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Product Loop</span>
            </Link>
            <Link
              href="/presentation"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeApp === 'presentation'
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Presentation Loop</span>
            </Link>
          </nav>
        </div>

        {/* Center: Phase Stepper Pills (Desktop) */}
        <div className="hidden xl:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
          {phases.map((item, idx) => {
            const isActive = currentPhase === item.phase;
            return (
              <div
                key={idx}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all text-[11px] flex items-center gap-1 ${
                  isActive 
                    ? (activeApp === 'product' ? 'bg-emerald-600 text-white shadow-md' : 'bg-blue-600 text-white shadow-md')
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* External Access / Live Share Guide Button */}
          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 text-emerald-400 border border-emerald-500/40 text-xs font-semibold transition-all shadow-sm hover:shadow-emerald-950 min-h-[44px]"
            title="외부 모바일 및 동료 접속 가이드"
            aria-label="외부 접속 가이드 열기"
          >
            <div className="relative flex items-center justify-center">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <span className="hidden sm:inline">외부 접속 &amp; 공유</span>
          </button>

          {/* Reset Loop Button */}
          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition min-h-[44px]"
              title="현재 가설 및 한 판을 초기 상태로 리셋"
              aria-label="루프 초기화"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">초기화</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="메뉴 토글"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 space-y-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase">루프 전환</span>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium ${
                activeApp === 'product' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Product Loop (제품 실험 한 판)</span>
              </div>
              {activeApp === 'product' && <span className="text-[10px] font-bold">Active</span>}
            </Link>
            <Link
              href="/presentation"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium ${
                activeApp === 'presentation' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Presentation className="w-4 h-4" />
                <span>Presentation Loop (발표자료 한 판)</span>
              </div>
              {activeApp === 'presentation' && <span className="text-[10px] font-bold">Active</span>}
            </Link>
          </div>

          <div className="border-t border-slate-800/80 pt-2 flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase">진행 단계</span>
            <div className="grid grid-cols-2 gap-1.5">
              {phases.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg text-[11px] ${
                    currentPhase === item.phase
                      ? 'bg-emerald-600/20 text-emerald-300 font-semibold border border-emerald-500/30'
                      : 'text-slate-400 bg-slate-900/60'
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
