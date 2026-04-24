export type Gender = "M" | "F";

export interface Member {
  no: number;
  name: string;
  gender: Gender;
  ntrp: string;
}

export const members: Member[] = [
  { no: 1, name: "최복수", gender: "M", ntrp: "?" },
  { no: 2, name: "이윤표", gender: "M", ntrp: "?" },
  { no: 3, name: "안종웅", gender: "M", ntrp: "?" },
  { no: 4, name: "정윤영", gender: "M", ntrp: "?" },
  { no: 5, name: "박주영", gender: "M", ntrp: "?" },
  { no: 6, name: "양다영", gender: "F", ntrp: "?" },
  { no: 7, name: "김미란", gender: "F", ntrp: "?" },
  { no: 8, name: "김대일", gender: "M", ntrp: "?" },
  { no: 9, name: "이주영", gender: "F", ntrp: "?" },
  { no: 10, name: "류호정", gender: "M", ntrp: "?" },
];
