import { ProjectCanvas } from '@/types/product-loop';

export interface FigmaCanvasPayload {
  name: string;
  version: string;
  pages: {
    id: string;
    name: string;
    frames: {
      id: string;
      name: string;
      x: number;
      y: number;
      width: number;
      height: number;
      type: 'SPEC_STICKY' | 'SCREEN_FRAME' | 'FLOW_CONNECTOR';
      data: Record<string, unknown>;
    }[];
  }[];
}

export class FigmaExporterAgent {
  /**
   * ProjectCanvas를 Figma Plugin 및 REST API로 한 판에 임포트 가능한
   * Figma Node 트리 구조로 변환합니다.
   */
  public exportToFigmaSchema(canvas: ProjectCanvas): FigmaCanvasPayload {
    const frames: FigmaCanvasPayload['pages'][0]['frames'] = [];

    // 1. 좌측 영역: 명세 (Spec Sticky Board)
    frames.push({
      id: `figma-spec-${canvas.spec.id}`,
      name: `[명세/PRD] ${canvas.spec.title}`,
      x: 0,
      y: 0,
      width: 480,
      height: 960,
      type: 'SPEC_STICKY',
      data: {
        title: canvas.spec.title,
        overview: canvas.spec.overview,
        userStories: canvas.spec.userStories,
        functionalRequirements: canvas.spec.functionalRequirements,
        edgeCases: canvas.spec.edgeCases,
        acceptanceCriteria: canvas.spec.acceptanceCriteria
      }
    });

    // 2. 중앙~우측 영역: 시안들 (Screen Frames) 나란히 배치
    let startX = 560;
    canvas.screens.forEach((screen, index) => {
      frames.push({
        id: `figma-screen-${screen.id}`,
        name: screen.name,
        x: startX + index * 420,
        y: 0,
        width: 375,
        height: 812,
        type: 'SCREEN_FRAME',
        data: {
          screenId: screen.id,
          stateType: screen.stateType,
          description: screen.description,
          components: screen.components
        }
      });
    });

    // 3. 플로우 커넥터 (Flow Connectors)
    canvas.flows.forEach((flow, index) => {
      frames.push({
        id: `figma-flow-${flow.id}`,
        name: `Flow: ${flow.triggerAction}`,
        x: startX + index * 420 + 375,
        y: 400,
        width: 45,
        height: 2,
        type: 'FLOW_CONNECTOR',
        data: {
          from: flow.fromScreenId,
          to: flow.toScreenId,
          trigger: flow.triggerAction,
          condition: flow.condition
        }
      });
    });

    return {
      name: `[Pencil] ${canvas.title}`,
      version: '2.0.0',
      pages: [
        {
          id: 'page-1',
          name: '📐 프로젝트 한 판 (Canvas)',
          frames
        }
      ]
    };
  }
}

export const figmaExporterAgent = new FigmaExporterAgent();
