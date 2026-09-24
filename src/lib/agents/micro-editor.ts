import { ProjectCanvas } from '@/types/product-loop';

export class MicroEditorAgent {
  /**
   * 한 판이 생성된 이후, 자연어 지시("손처럼 쓰는 AI")로 
   * 명세, 시안 컴포넌트, 플로우를 미세 조정(Micro-Edit)합니다.
   */
  public async applyMicroEdit(canvas: ProjectCanvas, instruction: string): Promise<{ updatedCanvas: ProjectCanvas; changeSummary: string }> {
    const updated: ProjectCanvas = JSON.parse(JSON.stringify(canvas));
    const inst = instruction.toLowerCase().trim();
    let summary = '';

    if (inst.includes('네비게이션') || inst.includes('하단') || inst.includes('탭바') || inst.includes('nav')) {
      // Screens updated with bottom tab bar
      updated.screens.forEach(s => {
        s.components.unshift({
          name: 'MobileBottomNavigation',
          type: 'TabBar',
          propsSummary: 'items: ["홈", "탐색", "내 노트", "설정"], activeIndex: 0'
        });
      });
      updated.spec.functionalRequirements.push({
        id: `FR-${updated.spec.functionalRequirements.length + 1}`,
        feature: '모바일 하단 고정 탭바 지원',
        behavior: '모바일 뷰포트 진입 시 헤더 네비게이션을 하단 4단 탭바로 일괄 전환',
        priority: 'P1'
      });
      summary = '모든 시안에 [MobileBottomNavigation] 컴포넌트를 추가하고 기능 명세(FR)를 업데이트했습니다.';
    } else if (inst.includes('토큰') || inst.includes('색상') || inst.includes('color') || inst.includes('다크')) {
      updated.designTokens.primaryColor = inst.includes('다크') ? '#22C55E' : '#2563EB';
      updated.designTokens.surfaceColor = inst.includes('다크') ? '#121212' : '#FFFFFF';
      summary = `디자인 토큰을 갱신했습니다 (Primary: ${updated.designTokens.primaryColor}, Surface: ${updated.designTokens.surfaceColor}).`;
    } else if (inst.includes('에러') || inst.includes('케이스') || inst.includes('인증')) {
      const newEdgeCase = `신규 예외 케이스: ${instruction}에 대한 세션 만료 및 재로그인 유도 플로우 추가`;
      updated.spec.edgeCases.push(newEdgeCase);
      updated.screens[3].description += ` (${instruction} 반영)`;
      summary = `명세의 엣지 케이스 항목에 "${instruction}" 관련 처리 요건을 추가했습니다.`;
    } else {
      // General specification update
      updated.spec.userStories.push(`추가 개선: ${instruction}`);
      summary = `프로젝트 한 판의 기획 의도에 "${instruction}" 피드백을 반영했습니다.`;
    }

    return {
      updatedCanvas: updated,
      changeSummary: summary
    };
  }
}

export const microEditorAgent = new MicroEditorAgent();
