import ExpenseNotice from "./ExpenseNotice";

export default function Notice8Content() {
  return (
    <ExpenseNotice
      heading="2026 NOAD 하반기 오픈 사용 비용 공개"
      subtitle="10월 18일(일) 대회 집행 내역"
      categories={[
        {
          icon: "🍖",
          name: "식비",
          items: [
            { name: "농부네뒷고기 (뒤풀이)", amount: 419700 },
            { name: "식물원김밥", amount: 84500 },
            { name: "간식 · 음료 & 과자", amount: 13280 },
          ],
        },
        {
          icon: "🏆",
          name: "상금",
          items: [{ name: "MT 상금 (승점 랭킹전 · 행운상)", amount: 250000 }],
        },
        {
          icon: "🎾",
          name: "코트",
          items: [{ name: "코트 추가 시간", amount: 60000 }],
        },
        {
          icon: "🎁",
          name: "굿즈",
          items: [
            { name: "키링 굿즈", amount: 99600 },
            { name: "수건 굿즈", amount: 107800 },
          ],
        },
      ]}
    />
  );
}
