---
description: TypeSafe AI 자동 감지, 프롬프트 변환 및 2단계 승인 호출 워크플로우 규칙
trigger: always_on
---

# TypeSafe AI 자동 감지 및 2단계 승인 호출 워크플로우

사용자가 자연어로 입력한 프롬프트 중 **System One(판단, 분류, 조건 검증, 점수 평가, 의도 라우팅)** 모델에 적합한 작업이 감지되거나, 명시적으로 TypeSafe 실행을 요청했을 때 아래의 2단계 대화형 워크플로우를 반드시 준수합니다.

---

## 1. 감지 기준 (Detection Criteria)

### A. 자동 감지 대상 (Semantic Intent)
사용자의 자연어 질문이 아래 특성을 갖는 경우:
1. **조건 및 진위 판별 (Noul 적합)**: 예/아니오, 긴급도 여부, 정책 위반 여부, 스팸 여부, 사실 여부 등 단일 조건 검증
2. **범주 분류 및 라우팅 (Choice 적합)**: 지원 부서 분류(결제/기술/계정), 감정 분류, 카테고리 매핑 등 상호 배타적 선택지 중 하나 결정
3. **등급 및 다차원 점수 평가 (Score 적합)**: 리뷰 만족도(1~5단계), 위험도(Low/Medium/High/Critical), 우선순위 등 서술적 레벨 기반 평가
4. **복합 질의 (Composite)**: 동일한 맥락(State)에 대해 복수의 Noul, Choice, Score 질문을 병렬로 판단해야 하는 경우

> **비감지 대상**: 일반적인 코드 작성(컴포넌트 구현, 버그 수정), 장문의 텍스트 생성(에세이 작성, 번역, 요약문 생성), 일반적인 대화 등은 TypeSafe 변환 대상이 아니며 일반 LLM 응답으로 처리합니다.

### B. 수동 트리거 (Manual Trigger)
사용자가 프롬프트에 `/typesafe`, `@typesafe`, `[typesafe]` 키워드를 포함하거나 "TypeSafe로 변환해줘", "TypeSafe API로 판단해줘"라고 명시한 경우 즉시 발동합니다.

---

## 2. 2단계 상호작용 프로세스 (2-Step Interaction Flow)

### [1단계] 변환 제안 승인 (`ask_question`)
적합성이 감지되면 일반 텍스트로 바로 장문의 답변을 내지 않고, 먼저 `ask_question` 도구를 호출하여 사용자에게 변환 의사를 확인합니다.

```json
{
  "questions": [
    {
      "question": "입력하신 질문은 TypeSafe AI (System One 결정 모델)를 활용하기에 적합합니다. TypeSafe AI 형식으로 자동 변환하시겠습니까?",
      "options": [
        "(Recommended) 네, TypeSafe AI 프롬프트(JSON)로 자동 변환하고 예상 결과를 확인하겠습니다.",
        "아니오, 일반 LLM 대화로 계속 답변해주세요."
      ],
      "is_multi_select": false
    }
  ]
}
```

- 사용자가 거절할 경우: 기존 방식대로 일반 LLM 자연어 답변을 제공하고 종료합니다.
- 사용자가 승인할 경우: 아래 [2단계]로 진행합니다.

---

### [2단계] JSON 변환 및 출력 스키마 명세 프리뷰 제공
승인을 받으면 즉시 다음 두 가지 요소를 화면에 명확히 마크다운으로 렌더링합니다:

#### 1) 변환된 TypeSafe JSON 페이로드
```json
{
  "state": "<평가 대상이 되는 원문 또는 구조화된 컨텍스트>",
  "model": "jev-latest",
  "questions": {
    "<question_id>": {
      "type": "noul | choice | score",
      "instructions": "<질문 지침>",
      "criteria": { ... }
    }
  }
}
```

#### 2) 출력 스키마 명세 중심의 예상 결과 (Dry-run Preview)
실제 API를 치기 전에 모델이 반환할 데이터 스키마와 필드 의미를 명확히 제시합니다:
- **Primitive 종류**: (예: Noul / Choice / Score)
- **반환 데이터 스키마**:
  - `answer`: 선택된 라벨 또는 True/False
  - `probabilities` / `value`: 각 선택지별 보정 확률 ($0.0 \sim 1.0$)
  - `confidence`: 확률 분포의 집중도 ($0.0 \sim 1.0$)
- **해석 가이드**: 임계값(Threshold) 기준 및 비즈니스 로직 적용 방안 안내

#### 3) 실제 API 호출 최종 확인 (`ask_question`)
프리뷰를 보여준 후 곧바로 `ask_question` 도구로 실제 호출 여부를 묻습니다.

```json
{
  "questions": [
    {
      "question": "변환된 TypeSafe JSON과 출력 스키마를 확인하셨습니다. 실제 TypeSafe API를 호출하시겠습니까?",
      "options": [
        "(Recommended) 네, 실제 TypeSafe API를 호출하여 결과를 확인하겠습니다.",
        "아니오, API 호출 없이 현재 프리뷰 상태로 종료합니다."
      ],
      "is_multi_select": false
    }
  ]
}
```

---

### [3단계] API 호출 및 결과 출력 (Execution)
사용자가 API 호출을 승인하면:
1. `call_mcp_tool` (서버: `typesafe-ai`, 도구: `typesafe_evaluate`) 또는 `node .agents/skills/typesafe-ai/scripts/mcp-server.js`를 통해 실제 API를 호출합니다.
2. 만약 API 키가 누락되어 있다면 `.env` 파일에 `TYPESAFE_API_KEY` 입력을 친절히 안내합니다.
3. API 호출이 완료되면:
   - 반환된 정형 응답(JSON)
   - 주요 판단 결과 요약 (선택값, 확률 분포 차트/테이블, 신뢰도 수준)
   - 이를 코드로 활용하는 예시 스니펫
   을 보기 쉽게 정리하여 사용자에게 최종 제공합니다.
