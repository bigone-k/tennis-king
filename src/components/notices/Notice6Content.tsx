export default function Notice6Content() {
  return (
    <div className="space-y-8">
      {/* 헤더 배너 */}
      <div className="bg-emerald-900 rounded-2xl p-6 md:p-8 text-white text-center">
        <p className="text-xs font-medium mb-2 text-emerald-300 uppercase tracking-widest">
          NoAD 클럽 대회
        </p>
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
          🎾 2026 NOAD 하반기 오픈 🏆
        </h2>
        <p className="text-sm text-white/60 mt-2">
          10월 18일(일) · 승점 랭킹전 · 행운상 · 뒤풀이
        </p>
      </div>

      {/* 1. 일정 안내 */}
      <section>
        <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
            1
          </span>
          일정 안내
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: "📅", label: "일시", value: "10월 18일(일)", desc: "10:00 ~ 16:00" },
            { icon: "🎾", label: "장소", value: "와이티게라지 테니스", desc: "" },
            { icon: "🍖", label: "식사", value: "안양 농부네뒷고기", desc: "17:00" },
          ].map((item) => (
            <div key={item.label} className="card p-5 text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                {item.label}
              </p>
              <p className="font-bold text-gray-900 text-sm">{item.value}</p>
              {item.desc && (
                <p className="text-xs text-emerald-700 font-bold mt-1">
                  {item.desc}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="card p-4 border-l-[3px] border-lime-400 mt-4">
          <p className="text-sm text-gray-600">
            🍖 식사 장소 위치:{" "}
            <a
              href="https://naver.me/GtYeSLOH"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-700 underline underline-offset-2"
            >
              네이버 지도에서 보기
            </a>
          </p>
        </div>
      </section>

      {/* 2. 이벤트 안내 */}
      <section>
        <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
            2
          </span>
          이벤트 안내
        </h3>

        {/* 승점 랭킹전 */}
        <div className="card p-5 md:p-6">
          <p className="font-extrabold text-gray-900 mb-4">
            ① 승점 랭킹전 💰
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { medal: "🥇", rank: "1등", prize: "60,000원" },
              { medal: "🥈", rank: "2등", prize: "50,000원" },
              { medal: "🥉", rank: "3등", prize: "40,000원" },
            ].map((item) => (
              <div
                key={item.rank}
                className="bg-gray-50 rounded-xl p-3 md:p-4 text-center"
              >
                <div className="text-2xl md:text-3xl mb-1">{item.medal}</div>
                <p className="text-xs text-gray-500 font-bold mb-1">
                  {item.rank}
                </p>
                <p className="text-sm md:text-base font-extrabold text-emerald-700">
                  {item.prize}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">현금</p>
              </div>
            ))}
          </div>
        </div>

        {/* 행운상 */}
        <div className="card p-5 md:p-6 mt-4">
          <p className="font-extrabold text-gray-900 mb-4">
            ② 행운상 🎯{" "}
            <span className="text-xs font-bold text-rose-600">(단 1명!)</span>
          </p>
          <div className="space-y-3 text-sm text-gray-600 mb-4">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <p>
                <span className="font-bold text-gray-900">서브라인</span>에서
                공 맞히기 챌린지!
              </p>
            </div>
          </div>
          <div className="bg-emerald-900 text-white rounded-xl px-6 py-4 text-center">
            <p className="text-[11px] text-emerald-300 uppercase tracking-widest mb-1">
              행운의 주인공 1명
            </p>
            <p className="text-2xl font-extrabold">현금 100,000원</p>
          </div>
        </div>
      </section>

      {/* 3. 혜택 */}
      <section>
        <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
            3
          </span>
          혜택
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: "🍪", name: "간식 제공", desc: "대회 중 간식이 준비됩니다" },
            { icon: "🎁", name: "노애드 굿즈 증정", desc: "노애드 키링 · 노애드 수건" },
          ].map((item) => (
            <div key={item.name} className="card p-5 text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="font-bold text-gray-900 text-sm mb-1">
                {item.name}
              </p>
              <p className="text-[11px] text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 마무리 메시지 */}
      <div className="bg-gradient-to-br from-emerald-50 to-lime-50 rounded-2xl p-6 text-center border border-emerald-100">
        <div className="text-3xl mb-3">🎾🔥</div>
        <p className="text-base font-extrabold text-emerald-900 mb-1">
          모두 즐거운 시간이 될 수 있도록
        </p>
        <p className="text-sm text-emerald-700">많은 참여 부탁드립니다!</p>
      </div>
    </div>
  );
}
