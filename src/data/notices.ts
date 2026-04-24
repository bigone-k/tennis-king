export interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
}

export const notices: Notice[] = [
  {
    id: 1,
    title: "4월 25일 테니스 MT 안내",
    content:
      "4월 25일 테니스 MT 진행 방식과 사은품, 게임 규칙을 안내드립니다.",
    date: "2026-02-19",
    author: "관리자",
  },
  {
    id: 2,
    title: "신규 회원 모집",
    content:
      "테왕사신기 클럽에서 신규 회원을 모집합니다. 관심 있으신 분들은 연락 바랍니다.",
    date: "2026-04-04",
    author: "관리자",
  },
  {
    id: 3,
    title: "[제안-미결정된내용] 유보금+코트비 or 월 회비 방식 결정 (기존 회원)",
    content:
      "기존 회원 대상으로 회비 운영 방식에 대한 의견을 수렴합니다. 유보금+코트비 방식과 월 회비 방식 중 선택해 주세요.",
    date: "2026-04-04",
    author: "관리자",
  },
];

export function getNoticeById(id: number): Notice | undefined {
  return notices.find((n) => n.id === id);
}
