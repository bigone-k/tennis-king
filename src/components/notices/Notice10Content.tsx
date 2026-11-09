const won = (amount: number) => `${amount.toLocaleString("ko-KR")}원`;

/** 연간(12개월) 기준 — 모든 합계는 아래 값으로 계산한다. */
const MONTHS = 12;
const MONTHLY_FEE = 60000;
const CURRENT_MEMBERS = 12;
const MEMBER_SCENARIOS = [12, 15, 18, 20];

const fixedExpenses = [
  { icon: "🎾", name: "코트비", detail: "3개월 1,800,000원 × 4회", amount: 7200000 },
  { icon: "🟡", name: "캔볼", detail: "72캔", amount: 240000 },
];
const fixedTotal = fixedExpenses.reduce((sum, e) => sum + e.amount, 0);

const OFFICERS = 3;
const benefitPlans = [
  { key: "A", monthly: 30000 },
  { key: "B", monthly: 20000 },
  { key: "C", monthly: 10000 },
].map((p) => ({ ...p, annual: OFFICERS * p.monthly * MONTHS }));

const income = (members: number) => members * MONTHLY_FEE * MONTHS;

export default function Notice10Content() {
  return (
    <div className="space-y-8">
      {/* 헤더 배너 */}
      <div className="bg-emerald-900 rounded-2xl p-6 md:p-8 text-white text-center">
        <p className="text-xs font-medium mb-2 text-emerald-300 uppercase tracking-widest">
          투명한 클럽 운영
        </p>
        <h2 className="text-lg md:text-2xl font-extrabold tracking-tight">
          💰 연간 회비 예산안
        </h2>
        <p className="text-sm text-white/60 mt-2">
          연간(12개월) 기준 입금·지출과 인원별 예상 유보금
        </p>
        <div className="mt-5 inline-block bg-white/10 rounded-xl px-6 py-3">
          <p className="text-[11px] text-emerald-300 uppercase tracking-widest mb-1">
            현재 {CURRENT_MEMBERS}명 기준 연간 입금
          </p>
          <p className="text-2xl md:text-3xl font-extrabold tabular-nums">
            {won(income(CURRENT_MEMBERS))}
          </p>
        </div>
      </div>

      {/* 1. 입금 */}
      <section>
        <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
            1
          </span>
          입금
        </h3>

        <div className="card p-5 md:p-6 space-y-1.5">
          <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
            <span>인당 월 회비</span>
            <span className="tabular-nums">{won(MONTHLY_FEE)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
            <span>
              현재 인원 {CURRENT_MEMBERS}명 × {MONTHS}개월
            </span>
            <span className="tabular-nums font-bold text-emerald-700">
              {won(income(CURRENT_MEMBERS))}
            </span>
          </div>
        </div>
      </section>

      {/* 2. 고정 지출 */}
      <section>
        <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
            2
          </span>
          고정 지출
        </h3>

        <div className="card p-5 md:p-6 space-y-1.5">
          {fixedExpenses.map((e) => (
            <div
              key={e.name}
              className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2"
            >
              <span>
                {e.icon} {e.name}{" "}
                <span className="text-xs text-gray-400">({e.detail})</span>
              </span>
              <span className="tabular-nums">{won(e.amount)}</span>
            </div>
          ))}
          <div className="flex items-baseline justify-between border-t border-gray-200 pt-3 mt-3">
            <p className="font-extrabold text-gray-900">합계</p>
            <p className="font-extrabold text-emerald-700 tabular-nums">
              {won(fixedTotal)}
            </p>
          </div>
        </div>
      </section>

      {/* 3. 운영진 베네핏 안 */}
      <section>
        <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
            3
          </span>
          운영진 베네핏 안 (미결정)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {benefitPlans.map((p) => (
            <div key={p.key} className="card p-4 text-center">
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                {p.key}안
              </p>
              <p className="font-bold text-gray-900 text-sm">
                운영진 {OFFICERS}명 × 월 {won(p.monthly)}
              </p>
              <p className="text-lg font-extrabold text-emerald-700 mt-1 tabular-nums">
                연 {won(p.annual)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. 인원별 예상 유보금 */}
      <section>
        <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
            4
          </span>
          인원별 예상 유보금
        </h3>

        <div className="card p-0 overflow-x-auto">
          <table className="w-full text-sm tabular-nums">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs">
                <th className="px-3 py-2.5 text-left font-bold">인원</th>
                <th className="px-3 py-2.5 text-right font-bold">연간 입금</th>
                <th className="px-3 py-2.5 text-right font-bold">고정 지출 후</th>
                {benefitPlans.map((p) => (
                  <th key={p.key} className="px-3 py-2.5 text-right font-bold text-emerald-700">
                    {p.key}안 유보금
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MEMBER_SCENARIOS.map((members) => {
                const afterFixed = income(members) - fixedTotal;
                return (
                  <tr
                    key={members}
                    className={`border-t border-gray-100 ${
                      members === CURRENT_MEMBERS ? "bg-emerald-50/50" : ""
                    }`}
                  >
                    <td className="px-3 py-2.5 font-bold text-gray-900 whitespace-nowrap">
                      {members}명
                      {members === CURRENT_MEMBERS && (
                        <span className="ml-1 text-[11px] text-emerald-600">(현재)</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right text-gray-600 whitespace-nowrap">
                      {won(income(members))}
                    </td>
                    <td className="px-3 py-2.5 text-right text-gray-600 whitespace-nowrap">
                      {won(afterFixed)}
                    </td>
                    {benefitPlans.map((p) => (
                      <td
                        key={p.key}
                        className="px-3 py-2.5 text-right font-bold text-emerald-700 whitespace-nowrap"
                      >
                        {won(afterFixed - p.annual)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 안내 사항 */}
      <div className="card p-5 border-l-[3px] border-amber-400 bg-amber-50/40">
        <p className="font-extrabold text-gray-900 mb-3">📌 안내 사항</p>
        <div className="space-y-2">
          {[
            "모든 금액은 연간(12개월) 기준 예상치입니다.",
            "유보금은 연간 입금에서 고정 지출과 운영진 베네핏을 뺀 금액입니다.",
            "운영진 베네핏은 A안, B안, C안 중 아직 결정하지 않았습니다. 의견을 운영진에게 전달해 주세요.",
            "인원별 금액은 코트비와 캔볼 비용이 인원과 관계없이 같다고 가정해 계산했습니다.",
          ].map((text) => (
            <div key={text} className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5 text-sm">•</span>
              <p className="text-sm text-gray-700">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
