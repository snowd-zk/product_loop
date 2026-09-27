'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  Zap, 
  ShieldCheck, 
  Server, 
  Wifi, 
  Terminal, 
  Layers, 
  Sparkles 
} from 'lucide-react';

interface ExternalShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExternalShareModal({ isOpen, onClose }: ExternalShareModalProps) {
  const [activeTab, setActiveTab] = useState<'cloudflare' | 'localtunnel' | 'vercel' | 'lan'>('cloudflare');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-950">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                외부 접속 및 서비스 공유 가이드
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE HUB
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                로컬 환경(포트 3000)을 외부 인터넷 및 모바일에서 접속할 수 있는 최적의 솔루션
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800/80 bg-slate-900/60 px-6 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('cloudflare')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'cloudflare'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            1. Cloudflare Tunnel (가장 추천)
          </button>
          <button
            onClick={() => setActiveTab('localtunnel')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'localtunnel'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            2. npx localtunnel (무설치 즉시)
          </button>
          <button
            onClick={() => setActiveTab('vercel')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'vercel'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            3. Vercel 배포 (24/7 영구 운영)
          </button>
          <button
            onClick={() => setActiveTab('lan')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'lan'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            4. 동일 Wi-Fi 접속
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed">
          {/* 1. Cloudflare Tunnel */}
          {activeTab === 'cloudflare' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-white text-xs">왜 Cloudflare Tunnel이 가장 좋은가요?</h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    회원가입/로그인 없이 무료로 임의의 글로벌 보안 HTTPS URL을 즉시 생성하며, 세션 만료 시간 제한이 없습니다. 스마트폰과 외부 동료에게 가장 안정적입니다.
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                  1단계: 맥북 터미널에서 cloudflared 설치 (최초 1회)
                </span>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between font-mono text-[11px] text-slate-200">
                  <code>brew install cloudflared</code>
                  <button
                    onClick={() => copyToClipboard('brew install cloudflared', 'cf-install')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="복사"
                  >
                    {copiedKey === 'cf-install' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                  2단계: 로컬 포트 3000 터널 오픈 명령어 실행
                </span>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between font-mono text-[11px] text-emerald-300">
                  <code>cloudflared tunnel --url http://localhost:3000</code>
                  <button
                    onClick={() => copyToClipboard('cloudflared tunnel --url http://localhost:3000', 'cf-run')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="복사"
                  >
                    {copiedKey === 'cf-run' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p>💡 실행 후 터미널 출력에 나오는 <span className="text-emerald-400 font-mono">https://xxxx.trycloudflare.com</span> 주소로 스마트폰이나 외부에서 접속하시면 됩니다.</p>
              </div>
            </div>
          )}

          {/* 2. localtunnel */}
          {activeTab === 'localtunnel' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-3">
                <Terminal className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-white text-xs">brew 설치도 필요 없는 무설치 초간단 터널</h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Node.js에 내장된 `npx`를 사용하여 별도 프로그램 설치 없이 즉시 터널을 오픈합니다.
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                  터미널에서 바로 실행
                </span>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between font-mono text-[11px] text-indigo-300">
                  <code>npx localtunnel --port 3000</code>
                  <button
                    onClick={() => copyToClipboard('npx localtunnel --port 3000', 'lt-run')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="복사"
                  >
                    {copiedKey === 'lt-run' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p>💡 생성된 <span className="text-indigo-400 font-mono">https://xxxx.loca.lt</span> 주소에 처음 접속할 때 나타나는 비밀번호 창에는 내 공인 IP(또는 화면 안내대로)를 입력하면 즉시 연결됩니다.</p>
              </div>
            </div>
          )}

          {/* 3. Vercel */}
          {activeTab === 'vercel' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-start gap-3">
                <Server className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-white text-xs">내 컴퓨터를 꺼도 24시간 접속 가능한 공식 배포</h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Next.js를 만든 Vercel의 무료 플랜을 사용하면, 글로벌 초고속 CDN과 평생 무료 HTTPS 도메인(`*.vercel.app`)을 얻을 수 있습니다.
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                  방법 A: 터미널에서 1분 만에 배포 (Vercel CLI)
                </span>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between font-mono text-[11px] text-blue-300">
                  <code>npx vercel</code>
                  <button
                    onClick={() => copyToClipboard('npx vercel', 'vc-run')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="복사"
                  >
                    {copiedKey === 'vc-run' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  * 실행 후 몇 가지 질문(Set up and deploy? [Y], Which scope? 등)에 Enter를 누르면 즉시 라이브 배포 완료!
                </p>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                  방법 B: GitHub 연동 (코드 수정 시 자동 재배포)
                </span>
                <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <li>이 프로젝트를 GitHub 저장소에 푸시합니다.</li>
                  <li><a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-blue-400 underline inline-flex items-center gap-0.5">vercel.com <ExternalLink className="w-3 h-3" /></a> 에 가입 후 [Add New Project]를 클릭합니다.</li>
                  <li>GitHub 레포지토리를 선택하고 [Deploy] 버튼을 누르면 1분 만에 배포 완료!</li>
                </ol>
              </div>
            </div>
          )}

          {/* 4. Same Wi-Fi LAN */}
          {activeTab === 'lan' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 flex items-start gap-3">
                <Wifi className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-white text-xs">같은 공유기(Wi-Fi)에 연결된 스마트폰으로 바로 보기</h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    맥북과 스마트폰이 같은 Wi-Fi에 연결되어 있다면 맥북의 사내/가정 IP 주소로 바로 열 수 있습니다.
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                  맥북 로컬 IP 확인 명령어
                </span>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between font-mono text-[11px] text-slate-200">
                  <code>ipconfig getifaddr en0</code>
                  <button
                    onClick={() => copyToClipboard('ipconfig getifaddr en0', 'ip-run')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="복사"
                  >
                    {copiedKey === 'ip-run' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                <p>예를 들어 내 IP가 <span className="font-mono text-emerald-400">192.168.0.15</span> 라면, 스마트폰 사파리나 크롬에서 <span className="font-mono text-emerald-400">http://192.168.0.15:3000</span> 으로 바로 접속할 수 있습니다.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>현재 로컬 포트: <strong>3000 (Active)</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
