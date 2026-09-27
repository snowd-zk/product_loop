'use client';

import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Monitor, 
  Layers, 
  AlertCircle 
} from 'lucide-react';
import { ScreenState } from '@/types/product-loop';

interface ScreenDetailModalProps {
  screen: ScreenState | null;
  onClose: () => void;
}

export default function ScreenDetailModal({ screen, onClose }: ScreenDetailModalProps) {
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  if (!screen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">{screen.name}</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                  {screen.stateType}
                </span>
              </div>
              <p className="text-xs text-slate-400">{screen.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Viewport Mode Switcher */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                  viewMode === 'mobile' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                모바일
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                  viewMode === 'desktop' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                데스크탑
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/70">
          {/* Left: Device Simulator Mockup */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 bg-slate-950 rounded-2xl border border-slate-800/80">
            {viewMode === 'mobile' ? (
              /* Mobile Frame */
              <div className="w-[320px] rounded-[36px] p-3 bg-slate-900 border-4 border-slate-700 shadow-2xl shadow-emerald-950/30 flex flex-col">
                {/* Dynamic Island / Notch */}
                <div className="h-5 flex items-center justify-center mb-2">
                  <div className="w-20 h-4 bg-slate-950 rounded-full flex items-center justify-end px-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  </div>
                </div>

                {/* Mobile Screen Surface */}
                <div className="bg-slate-950 rounded-[24px] p-4 flex flex-col gap-3 min-h-[460px] border border-slate-800/80">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-xs text-emerald-400">LINER AI</span>
                    <span className="text-[10px] text-slate-500">9:41 AM</span>
                  </div>

                  {/* Dynamic Render based on State */}
                  {screen.stateType === 'default' && (
                    <div className="flex-1 flex flex-col justify-center gap-3">
                      <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-left">
                        <span className="text-[10px] text-emerald-400 font-semibold block mb-1">💡 추천 질문 클러스터</span>
                        <p className="text-xs text-slate-100 font-medium leading-relaxed">
                          &quot;최신 AI 모델 벤치마크 비교와 비용 효율성 요약해줘&quot;
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                        <span>1분 퀵 서머리 모드</span>
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-[10px] text-emerald-400">✓</span>
                      </div>
                    </div>
                  )}

                  {screen.stateType === 'active' && (
                    <div className="flex-1 flex flex-col justify-center gap-3">
                      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40">
                        <span className="text-[10px] text-indigo-400 font-semibold block mb-1">⚡ 선택된 가설 프리뷰</span>
                        <p className="text-xs text-slate-100 font-medium">
                          관련 논문 4건 및 기술 블로그 8건 실시간 파싱 준비 완료
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button className="flex-1 bg-emerald-600 text-white font-medium text-xs py-2 rounded-xl">
                            탐색 실행
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {screen.stateType === 'loading' && (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
                      <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin"></div>
                      <p className="text-xs font-semibold text-slate-200">AI 에이전트 탐색 중...</p>
                      <div className="w-full space-y-2 mt-2">
                        <div className="h-2 rounded bg-slate-800 animate-pulse"></div>
                        <div className="h-2 w-3/4 rounded bg-slate-800 animate-pulse mx-auto"></div>
                      </div>
                    </div>
                  )}

                  {screen.stateType === 'error' && (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
                      <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-slate-200">네트워크 타임아웃</p>
                      <button className="bg-slate-800 text-slate-200 text-xs py-2 px-4 rounded-xl border border-slate-700">
                        재시도
                      </button>
                    </div>
                  )}

                  {/* Bottom Navigation Mock */}
                  <div className="mt-auto pt-2 border-t border-slate-800 flex justify-around text-slate-500 text-[10px]">
                    <span className="text-emerald-400 font-bold">홈</span>
                    <span>탐색</span>
                    <span>저장</span>
                    <span>프로필</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Desktop Frame */
              <div className="w-full max-w-lg rounded-2xl bg-slate-900 border-2 border-slate-700 shadow-2xl p-3 flex flex-col">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800 mb-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                  </div>
                  <div className="flex-1 bg-slate-950 px-3 py-1 rounded-lg text-[10px] text-slate-400 font-mono">
                    https://liner.ai/search?q=preview
                  </div>
                </div>
                <div className="bg-slate-950 rounded-xl p-5 min-h-[340px] flex flex-col justify-center">
                  <h3 className="text-sm font-semibold text-white mb-2">{screen.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{screen.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Component Specs Breakdown */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                화면 구성 컴포넌트 명세 ({screen.components.length}개)
              </h3>
              <div className="space-y-3">
                {screen.components.map((comp: { name: string; type: string; propsSummary?: string }, idx: number) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200">{comp.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {comp.type}
                      </span>
                    </div>
                    {comp.propsSummary && (
                      <p className="text-[11px] text-slate-400 mt-1">
                        {comp.propsSummary}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300 block">💡 Figma 동기화 연동 팁</span>
              <p className="text-[11px] leading-relaxed">
                상단 헤더의 &apos;Figma 연동&apos; 버튼을 누르면 이 화면 구조를 Figma Auto-layout 프레임으로 바로 생성할 수 있는 JSON 스키마가 클립보드에 복사됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
