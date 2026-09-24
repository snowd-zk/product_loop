# Product Loop: Liner Pencil 기반 제품 가설-검증 무한 루프 시스템

> **참고 원문**: [Liner Pencil 제작기: 제품 가설부터 구현·검증까지, 무한 Product Loop 구축](https://liner.com/ko/blog/liner-pencil)

---

## 1. 프로젝트 비전 및 배경 (What & Why)

### 1.1 핵심 배경: AI 생산성의 착시와 조직 속도
- **개인의 속도 vs 조직의 속도**: 
  팀원 개개인이 AI를 써서 코딩, 기획, QA 태스크를 빠르게 끝내더라도, **팀 전체가 제품을 발전시키는 속도(Product Iteration Speed)**는 비례해서 빨라지지 않습니다.
- **루프(Loop) 구조의 결핍**:
  진정한 조직의 혁신은 하나의 단발성 태스크를 빠르게 끝내는 것이 아니라, **실험의 결과에서 레슨런(Lessons Learned)을 얻고 이를 바탕으로 다음 가설로 즉시 연결되는 루프가 막힘없이 도는 것**에 달려 있습니다.

### 1.2 기존 프로덕트 개발 루프의 병목: "디자인 단계"
전통적인 제품 개발 파이프라인:
```text
지표·사용자 보이스 
  → 가설 도출 
  → 기획 
  → 디자인 (★ 치명적 병목 지점)
  → 개발 
  → QA 
  → 배포 
  → 결과 확인 
  → 레슨런 
  → 다음 가설 도출 (Infinite Loop)
```
- 가설 발굴, 기획, 코딩, QA는 이미 AI가 상당 부분 가속화하고 있습니다.
- 반면 기존 AI 디자인 도구들(Claude Artifacts, v0, Figma AI 등)은 **"단일 화면 시안"**을 만드는 데 그칩니다.
- 실제 제품을 만들고 검증하려면:
  1. 여러 상태(Default, Active, Error, Empty 등)를 한 번에 펼쳐놓고 보아야 함.
  2. 화면과 화면 간의 **상호작용 플로우(User Journey Flow)**가 연결되어야 함.
  3. 기획 의도와 엣지 케이스를 규정한 **명세(Spec/PRD)**가 함께 존재해야 함.
- 따라서 필요한 것은 "화면 하나를 만드는 AI"가 아니라 **"기획 + 명세 + 시안 + 플로우가 연결된 프로젝트 한 판을 만드는 AI"**입니다.

---

## 2. Product Loop의 핵심 4단계 아키텍처

```text
       ┌────────────────────────────────────────────────────────┐
       │                  1. Signal & Trigger                   │
       │  (지표 이상 감지, 유저 보이스/CS, 슬랙 일상 대화 인입)       │
       └──────────────────────────┬─────────────────────────────┘
                                  │
                                  ▼
       ┌────────────────────────────────────────────────────────┐
       │                2. Sharpening (가설 샤프닝)               │
       │   AI 대화를 통한 뾰족한 실험 설계 (타깃/기준/성공지표/통제변수)   │
       └──────────────────────────┬─────────────────────────────┘
                                  │
                                  ▼
       ┌────────────────────────────────────────────────────────┐
       │            3. Project Canvas ("프로젝트 한 판")           │
       │   - 명세 (PRD & Case/Acceptance Criteria)              │
       │   - 시안 (Multi-state Screen Previews)                 │
       │   - 플로우 (Screen Connectors & Navigation Journey)     │
       └──────────────────────────┬─────────────────────────────┘
                                  │
                                  ▼
       ┌────────────────────────────────────────────────────────┐
       │            4. Execution & Rapid QA / Deploy            │
       │   (컴포넌트 코드 생성, 자동 QA 체크리스트, A/B 배포)         │
       └──────────────────────────┬─────────────────────────────┘
                                  │
                                  ▼
       ┌────────────────────────────────────────────────────────┐
       │            5. Metric Evaluation & Lessons-Learned      │
       │   (결과 지표 분석 → 레슨런 요약 → 다음 가설 자동 제안)          │
       └──────────────────────────┬─────────────────────────────┘
                                  │
                                  └───────────► (무한 루프 재진입)
```

### (1) Sharpening (가설 샤프닝)
- 단순히 "이 화면 만들어줘"가 아닌, **"우리가 무엇을 풀고자 하는가"**를 함께 뾰족하게 만드는 인터뷰 엔진.
- 질문 항목:
  - 타깃 사용자 세그먼트 (Who)
  - 해결하려는 구체적 결핍 / 문제 (Problem)
  - 기존 대비 비교 기준선 (Baseline)
  - 성공과 실패를 판가름할 핵심 지표 (North Star & Guardrail Metrics)
  - 통제해야 할 변수와 엣지 케이스 (Control Variables)

### (2) Project Canvas Generation ("프로젝트 한 판")
- **명세(Spec)**: 기획 요건, 정책, 데이터 요구사항, 예외 처리
- **시안(Screens)**: 디자인 시스템 토큰 기반 상태별 화면 (Default, Loading, Error, Empty, Success)
- **플로우(Flows)**: 사용자 전환 경로, 트리거 조건, 인터랙션 엣지
- 피그마(Figma) 동기화 및 인터랙티브 웹 뷰어를 통해 PM, 디자이너, 엔지니어가 한 판에서 원클릭 리뷰 및 협업

### (3) Micro-Iteration in Canvas (미세 조정 루프)
- 한 판이 생성된 상태에서 자연어로 부분 수정:
  - *"모바일 네비게이션을 하단 탭바로 일괄 교체해줘"*
  - *"로그인 실패 시 3회 제한 엣지 케이스 화면 추가해줘"*
  - *"디자인 토큰을 브랜드 최신 팔레트로 리프레시해줘"*

### (4) Continuous Lessons-Learned Flywheel (레슨런 플라이휠)
- 배포된 실험의 실시간 지표 수집
- 가설 대비 실제 결과(Delta) 분석
- 실패 원인 및 성공 요인의 정량/정성적 레슨런 추출
- **다음 주기의 가설 후보군 3종 자동 생성** → 끊기지 않는 무한 Product Loop 구현

---

## 3. 기술 스택 및 디렉터리 구성

- **Frontend & Canvas**: Next.js 15+ (App Router), React, Tailwind CSS, Lucide Icons
- **Canvas / Flow Renderer**: Canvas Viewer with Tabbed Spec & Multi-Screen State Matrix & Flow Nodes
- **Agent Engines**:
  - `sharpening`: 대화형 가설 샤프닝 에이전트
  - `canvas-generator`: PRD, Wireframe Code, Node Graph 플로우 생성기
  - `qa-agent`: 가설 및 명세 기반 QA 시나리오 자동 추출기
  - `lessons-learned`: 실험 결과 분석 및 다음 가설 발굴기
- **Integrations**:
  - `Slack Webhook / Bot`: 슬랙 스레드에서 `@pencil` 호출하여 가설 샤프닝 및 한 판 생성
  - `Figma REST / Plugin Export`: 한 판 결과물을 Figma 파일로 직접 변환
