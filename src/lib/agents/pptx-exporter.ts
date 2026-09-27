import pptxgen from 'pptxgenjs';
import { PresentationCanvas, SlideItem } from '@/types/presentation-loop';

export class PPTXExporter {
  /**
   * PresentationCanvas 데이터를 표준 PowerPoint(.pptx) 파일로 변환합니다.
   * 각 슬라이드의 헤드 메시지, 세부 컴포넌트, 발표자 스크립트(Speaker Notes)까지 보존합니다.
   */
  public createPresentation(canvas: PresentationCanvas): pptxgen {
    const pres = new pptxgen();
    pres.layout = 'LAYOUT_16x9';
    pres.author = 'Presentation Loop Engine';
    pres.company = 'Product Loop AI';
    pres.title = canvas.title;

    canvas.slides.forEach((item: SlideItem) => {
      const slide = pres.addSlide();

      // 슬라이드 배경색
      slide.background = { color: 'F8FAFC' };

      // 상단 뱃지
      slide.addText(item.visualTokens.badgeText || `SLIDE ${item.slideNumber}`, {
        x: 0.8,
        y: 0.5,
        w: 3.5,
        h: 0.35,
        fontSize: 10,
        bold: true,
        color: 'FFFFFF',
        fill: { color: item.visualTokens.accentColor.replace('#', '') || '2563EB' },
        align: 'center'
      });

      // 헤드 메시지 (Takeaway)
      slide.addText(item.headMessage, {
        x: 0.8,
        y: 1.0,
        w: 11.7,
        h: 1.2,
        fontSize: 20,
        bold: true,
        color: '0F172A',
        fontFace: 'Arial'
      });

      // 서브타이틀
      if (item.subTitle) {
        slide.addText(item.subTitle, {
          x: 0.8,
          y: 2.1,
          w: 11.7,
          h: 0.4,
          fontSize: 12,
          color: '64748B'
        });
      }

      // 슬라이드 본문 컴포넌트들
      let currentY = 2.8;
      item.components.forEach((comp) => {
        if (comp.type === 'metric_card' && comp.data) {
          const metricData = comp.data as Record<string, string>;
          const metricText = metricData.metric || metricData.target || 'N/A';
          const labelText = comp.title || metricData.label || '';
          const baselineText = metricData.baseline ? `기준: ${metricData.baseline}` : '';

          slide.addText(`${labelText}\n${metricText}\n${baselineText}`, {
            x: 0.8,
            y: currentY,
            w: 5.5,
            h: 1.5,
            fontSize: 14,
            bold: true,
            color: '1E293B',
            fill: { color: 'EFF6FF' },
            line: { color: 'BFDBFE', width: 1 }
          });
        } else if (comp.type === 'column_grid' && comp.data) {
          const colData = comp.data as { columns?: { title: string; desc: string; badge?: string }[] };
          if (colData.columns) {
            colData.columns.forEach((col, idx) => {
              slide.addText(`[${col.badge || 'Pillar'}] ${col.title}\n\n${col.desc}`, {
                x: 0.8 + idx * 3.8,
                y: currentY,
                w: 3.5,
                h: 2.2,
                fontSize: 11,
                color: '334155',
                fill: { color: 'FFFFFF' },
                line: { color: 'E2E8F0', width: 1 }
              });
            });
          }
        } else if (comp.type === 'comparison_table' && comp.data) {
          const compData = comp.data as { 
            leftTitle: string; 
            leftItems: string[]; 
            rightTitle: string; 
            rightItems: string[] 
          };
          slide.addText(`${compData.leftTitle}\n• ` + compData.leftItems.join('\n• '), {
            x: 0.8,
            y: currentY,
            w: 5.5,
            h: 2.4,
            fontSize: 11,
            color: '64748B',
            fill: { color: 'F1F5F9' }
          });
          slide.addText(`${compData.rightTitle}\n• ` + compData.rightItems.join('\n• '), {
            x: 6.8,
            y: currentY,
            w: 5.5,
            h: 2.4,
            fontSize: 11,
            color: '0F172A',
            fill: { color: 'ECFDF5' },
            line: { color: 'A7F3D0', width: 1 }
          });
        }
      });

      // 발표자 스크립트 (Speaker Notes) 주입
      if (item.speakerNotes?.script) {
        slide.addNotes(
          `[발표 스크립트]\n${item.speakerNotes.script}\n\n[So What? 브릿지]\n${item.speakerNotes.soWhatBridge}\n(권장 시간: ${item.speakerNotes.estimatedSeconds}초)`
        );
      }
    });

    return pres;
  }

  /**
   * 브라우저에서 클라이언트 사이드 다운로드 트리거
   */
  public async downloadInBrowser(canvas: PresentationCanvas, filename?: string): Promise<void> {
    const pres = this.createPresentation(canvas);
    const fname = filename || `${canvas.title.replace(/[^a-zA-Z0-9가-힣_-]/g, '_')}.pptx`;
    await pres.writeFile({ fileName: fname });
  }
}

export const pptxExporter = new PPTXExporter();
