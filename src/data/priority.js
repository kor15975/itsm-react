// 우선순위 산출 규칙
// AI는 영향도와 긴급도까지만 판단하고, 우선순위는 이 표를 조회해 시스템이 계산한다.
// (ODC 원본 프로젝트의 PriorityMatrix와 동일한 규칙)

export const PRIORITY_MATRIX = {
  "높음-높음": "긴급",
  "높음-보통": "높음",
  "보통-높음": "높음",
  "높음-낮음": "보통",
  "보통-보통": "보통",
  "낮음-높음": "보통",
  "보통-낮음": "낮음",
  "낮음-보통": "낮음",
  "낮음-낮음": "낮음",
};

export function getPriority(impact, urgency) {
  return PRIORITY_MATRIX[`${impact}-${urgency}`] ?? "보통";
}

// 우선순위별 SLA 처리 기한 (시간)
export const SLA_HOURS = {
  긴급: 4,
  높음: 8,
  보통: 24,
  낮음: 72,
};

export const LEVELS = ["높음", "보통", "낮음"];
export const PRIORITIES = ["긴급", "높음", "보통", "낮음"];
export const STATUSES = [
  "접수중",
  "배정완료",
  "처리중",
  "답변완료",
  "처리완료",
  "반려",
];
