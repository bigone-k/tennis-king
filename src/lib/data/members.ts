export type Gender = "M" | "F";

export interface Member {
  no: number;
  name: string;
  gender: Gender;
  ntrp: string;
}

export const members: Member[] = [
  { no: 1, name: "최복수", gender: "M", ntrp: "2.5" },
  { no: 3, name: "안종웅", gender: "M", ntrp: "2.0" },
  { no: 4, name: "정윤영", gender: "M", ntrp: "2.5" },
  { no: 5, name: "박주영", gender: "M", ntrp: "2.0" },
  { no: 6, name: "양다영", gender: "F", ntrp: "1.5" },
  { no: 7, name: "김미란", gender: "F", ntrp: "2.0" },
  { no: 8, name: "김대일", gender: "M", ntrp: "3.0" },
  { no: 9, name: "이주영", gender: "F", ntrp: "1.5" },
  { no: 10, name: "류호정", gender: "M", ntrp: "2.5" },
  { no: 11, name: "이덕수", gender: "M", ntrp: "1.5" },
  { no: 12, name: "송성헌", gender: "M", ntrp: "1.5" },
  { no: 13, name: "윤영주", gender: "F", ntrp: "1.5" },
  { no: 14, name: "김한얼", gender: "M", ntrp: "1.5" },
];
