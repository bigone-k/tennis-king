const categories = [
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
].map((c) => ({ ...c, total: c.items.reduce((sum, i) => sum + i.amount, 0) }));

const grandTotal = categories.reduce((sum, c) => sum + c.total, 0);

const won = (amount: number) => `${amount.toLocaleString("ko-KR")}원`;

export default function Notice7Content() {
  return (
    <div className="space-y-8">
      {/* 헤더 배너 */}
      <div className="bg-emerald-900 rounded-2xl p-6 md:p-8 text-white text-center">
        <p className="text-xs font-medium mb-2 text-emerald-300 uppercase tracking-widest">
          투명한 클럽 운영
        </p>
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
          💰 2026 NOAD 하반기 오픈 사용 비용 공개
        </h2>
        <p className="text-sm text-white/60 mt-2">10월 18일(일) 대회 집행 내역</p>
        <div className="mt-5 inline-block bg-white/10 rounded-xl px-6 py-3">
          <p className="text-[11px] text-emerald-300 uppercase tracking-widest mb-1">
            총 사용 금액
          </p>
          <p className="text-2xl md:text-3xl font-extrabold tabular-nums">
            {won(grandTotal)}
          </p>
        </div>
      </div>

      {/* 1. 항목별 요약 */}
      <section>
        <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
            1
          </span>
          항목별 요약
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((c) => (
            <div key={c.name} className="card p-4 text-center">
              <div className="text-3xl mb-2">{c.icon}</div>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                {c.name}
              </p>
              <p className="font-bold text-gray-900 text-sm tabular-nums">
                {won(c.total)}
              </p>
              <p className="text-xs text-emerald-700 font-bold mt-1 tabular-nums">
                {Math.round((c.total / grandTotal) * 100)}%
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. 상세 내역 */}
      <section>
        <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
            2
          </span>
          상세 내역
        </h3>

        <div className="card p-5 md:p-6 space-y-5">
          {categories.map((c) => (
            <div key={c.name}>
              <div className="flex items-baseline justify-between mb-2">
                <p className="font-extrabold text-gray-900">
                  {c.icon} {c.name}
                </p>
                <p className="text-sm font-bold text-emerald-700 tabular-nums">
                  {won(c.total)}
                </p>
              </div>
              <div className="space-y-1.5">
                {c.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      {item.name}
                    </span>
                    <span className="tabular-nums">{won(item.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-baseline justify-between border-t border-gray-200 pt-4">
            <p className="font-extrabold text-gray-900">합계</p>
            <p className="text-lg font-extrabold text-emerald-700 tabular-nums">
              {won(grandTotal)}
            </p>
          </div>
        </div>
      </section>

      {/* 마무리 메시지 */}
      <div className="bg-gradient-to-br from-emerald-50 to-lime-50 rounded-2xl p-6 text-center border border-emerald-100">
        <div className="text-3xl mb-3">🙏🎾</div>
        <p className="text-base font-extrabold text-emerald-900 mb-1">
          함께해 주신 모든 분들 감사합니다
        </p>
        <p className="text-sm text-emerald-700">
          사용 내역에 궁금한 점은 운영진에게 편하게 문의해 주세요.
        </p>
      </div>
    </div>
  );
}
