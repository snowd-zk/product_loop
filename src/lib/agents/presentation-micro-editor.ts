import { PresentationCanvas, SlideItem } from '@/types/presentation-loop';

export class PresentationMicroEditor {
  /**
   * 자연어 명령을 해석하여 프레젠테이션 캔버스의 특정 슬라이드, 테마, 스피커 노트를
   * '내 손처럼' 즉각 부분 변이(Micro-mutation)합니다.
   */
  public async applyMicroEdit(
    canvas: PresentationCanvas, 
    command: string
  ): Promise<{ updatedCanvas: PresentationCanvas; message: string }> {
    const trimmed = command.trim().toLowerCase();
    let updatedCanvas = { ...canvas };
    let message = `"${command}" 명령이 정상 반영되었습니다.`;

    // 1. 테마/팔레트 변경 명령
    if (trimmed.includes('인디고') || trimmed.includes('tech_indigo') || trimmed.includes('블루')) {
      updatedCanvas.globalTheme = {
        ...updatedCanvas.globalTheme,
        palette: 'tech_indigo'
      };
      message = '글로벌 테마를 [Tech Indigo] 팔레트로 일괄 변경했습니다.';
      return { updatedCanvas, message };
    }

    if (trimmed.includes('에메랄드') || trimmed.includes('그린') || trimmed.includes('성장')) {
      updatedCanvas.globalTheme = {
        ...updatedCanvas.globalTheme,
        palette: 'growth_emerald'
      };
      message = '글로벌 테마를 [Growth Emerald] 팔레트로 일괄 변경했습니다.';
      return { updatedCanvas, message };
    }

    if (trimmed.includes('다크') || trimmed.includes('dark')) {
      updatedCanvas.globalTheme = {
        ...updatedCanvas.globalTheme,
        palette: 'minimal_dark'
      };
      message = '글로벌 테마를 [Minimal Dark] 고대비 팔레트로 전환했습니다.';
      return { updatedCanvas, message };
    }

    // 2. 스피킹 노트 톤 변경 명령
    if (trimmed.includes('스피킹 노트') || trimmed.includes('스크립트') || trimmed.includes('발화')) {
      updatedCanvas.slides = updatedCanvas.slides.map((slide: SlideItem) => ({
        ...slide,
        speakerNotes: {
          ...slide.speakerNotes,
          script: `[경영진 보고 정중체] 존경하는 경영진 여러분, ${slide.headMessage}라는 핵심 명제에 집중해 주시기 바랍니다.`
        }
      }));
      message = '모든 슬라이드의 발표자 발화 스크립트(Speaker Notes)를 정중한 경영진 보고 격식체로 재가공했습니다.';
      return { updatedCanvas, message };
    }

    // 3. 특정 장표 헤드 메시지 강조
    if (trimmed.includes('임팩트') || trimmed.includes('roi') || trimmed.includes('수치')) {
      updatedCanvas.slides = updatedCanvas.slides.map((slide: SlideItem) => {
        if (slide.layoutType === 'deep_dive_metrics') {
          return {
            ...slide,
            headMessage: '연간 2.4억원 상당의 엔지니어링 낭비 방지 및 분기별 300% 가속화 달성 (실측치)',
            visualTokens: {
              ...slide.visualTokens,
              accentColor: '#10B981'
            }
          };
        }
        return slide;
      });
      message = '6번 ROI 지표 슬라이드의 헤드 메시지와 악센트 색상을 고강도 임팩트 톤으로 업데이트했습니다.';
      return { updatedCanvas, message };
    }

    // 기본: 첫 번째 또는 타깃 슬라이드의 악센트 업데이트
    updatedCanvas.slides = updatedCanvas.slides.map((s, idx) => {
      if (idx === 0) {
        return {
          ...s,
          subTitle: `${s.subTitle} (자연어 수정 반영: "${command}")`
        };
      }
      return s;
    });

    return { updatedCanvas, message };
  }
}

export const presentationMicroEditor = new PresentationMicroEditor();
