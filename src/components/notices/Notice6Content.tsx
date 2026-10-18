import ExpenseNotice from "./ExpenseNotice";

export default function Notice6Content() {
  return (
    <ExpenseNotice
      heading="2026 NOAD 상반기 오픈 사용 비용 공개"
      subtitle="상반기 오픈 집행 내역"
      categories={[
        {
          icon: "🍖",
          name: "식비",
          items: [
            { name: "지평하나로마트", amount: 177730 },
            { name: "김밥", amount: 34200 },
            { name: "치킨", amount: 60000 },
          ],
        },
        {
          icon: "🎁",
          name: "사은품",
          items: [
            { name: "사은품", amount: 27800 },
            { name: "사은품", amount: 123400 },
          ],
        },
        {
          icon: "🎾",
          name: "대관비",
          items: [{ name: "코트 대관비", amount: 129000 }],
        },
      ]}
    />
  );
}
