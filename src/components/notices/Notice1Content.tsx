export default function Notice1Content() {
  return (
    <div className="space-y-8">
      {/* 헤더 배너 */}
      <div className="bg-emerald-900 rounded-2xl p-6 md:p-8 text-white text-center">
        <p className="text-xs font-medium mb-2 text-emerald-300 uppercase tracking-widest">
          NoAD 클럽 MT
        </p>
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
          4월 25일 테니스 MT 안내
        </h2>
        <p className="text-sm text-white/60 mt-2">
          게임 · 사은품 · 바베큐가 함께하는 하루
        </p>
      </div>

      {/* 1. 사은품 */}
      <section>
        <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
            1
          </span>
          사은품
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              icon: "💪",
              name: "나이키 롱 아대",
              count: "7개",
              desc: "손목용 · 다양한 색상",
            },
            {
              icon: "🐰",
              name: "흰토끼 댐프너",
              count: "2개",
              desc: "라켓 진동 흡수",
            },
          ].map((item) => (
            <div key={item.name} className="card p-5 text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="font-bold text-gray-900 text-sm mb-1">
                {item.name}
              </p>
              <p className="text-[11px] text-gray-400 mb-3">{item.desc}</p>
              <div className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                총 {item.count}
              </div>
            </div>
          ))}
        </div>

        <div className="card p-4 border-l-[3px] border-lime-400 mt-4">
          <p className="text-sm text-gray-600">
            🎁 사은품은{" "}
            <span className="font-bold text-emerald-700">총 9개</span>가
            준비되어 있으며, 게임 순위에 따라 선택할 수 있습니다.
          </p>
        </div>
      </section>

      {/* 2. 게임 방식 */}
      <section>
        <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
            2
          </span>
          게임 방식
        </h3>

        <div className="space-y-0">
          {[
            {
              step: 1,
              title: "랜덤 대진표 작성",
              desc: (
                <>
                  인원이 모두 모이면{" "}
                  <span className="font-bold text-emerald-700">
                    랜덤으로 대진표
                  </span>
                  를 작성합니다.
                </>
              ),
            },
            {
              step: 2,
              title: "총 4게임 진행",
              desc: (
                <>
                  게임은{" "}
                  <span className="font-extrabold text-emerald-700 text-base">
                    총 4게임
                  </span>
                  으로 진행됩니다.
                </>
              ),
            },
            {
              step: 3,
              title: "승점제 운영",
              desc: (
                <>
                  승리 시 개인별{" "}
                  <span className="font-bold text-emerald-700">+승점</span>,
                  패배 시{" "}
                  <span className="font-bold text-rose-600">-승점</span>이
                  부여됩니다.
                </>
              ),
            },
            {
              step: 4,
              title: "동점 처리",
              desc: (
                <>
                  승점이 동점인 경우{" "}
                  <span className="font-bold text-emerald-700">승 수</span>로
                  순위를 결정합니다.
                </>
              ),
            },
            {
              step: 5,
              title: "최종 순위 산정",
              desc: (
                <>
                  승점과 승 수를 기준으로{" "}
                  <span className="font-bold text-emerald-700">
                    1위 ~ 10위
                  </span>
                  까지 산정합니다.
                </>
              ),
            },
          ].map((item, i, arr) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {item.step}
                </div>
                {i < arr.length - 1 && (
                  <div className="w-0.5 h-full bg-emerald-200 min-h-[40px]" />
                )}
              </div>
              <div className="card p-4 mb-3 flex-1">
                <p className="font-bold text-gray-900 text-sm mb-1">
                  {item.title}
                </p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 승점 예시 */}
        <div className="card p-5 mt-4">
          <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-3 font-bold">
            승점 예시
          </p>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-center text-sm text-gray-500 mb-3">
              스코어{" "}
              <span className="font-extrabold text-gray-900">4 : 2</span> 결과
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-500 text-white rounded-lg p-3 text-center">
                <p className="text-[11px] font-medium text-emerald-100 mb-1">
                  승리 팀
                </p>
                <p className="text-xl font-extrabold">+2점</p>
                <p className="text-[11px] text-emerald-100 mt-1">개인별 승점</p>
              </div>
              <div className="bg-rose-500 text-white rounded-lg p-3 text-center">
                <p className="text-[11px] font-medium text-rose-100 mb-1">
                  패배 팀
                </p>
                <p className="text-xl font-extrabold">-2점</p>
                <p className="text-[11px] text-rose-100 mt-1">개인별 승점</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 사은품 선택 */}
      <section>
        <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
            3
          </span>
          사은품 선택
        </h3>

        <div className="card p-5 md:p-6">
          <div className="flex items-center justify-center mb-5">
            <div className="bg-emerald-900 text-white rounded-xl px-8 py-4 text-center">
              <p className="text-[11px] text-emerald-300 uppercase tracking-widest mb-1">
                선택 순서
              </p>
              <p className="text-2xl font-extrabold">1위 → 10위</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <p>
                <span className="font-bold text-gray-900">1위부터</span>{" "}
                사은품을 먼저 선택할 수 있는 기회를 얻습니다.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <p>
                순위에 따라 원하는 사은품을 자유롭게 선택할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 마무리 메시지 */}
      <div className="bg-gradient-to-br from-emerald-50 to-lime-50 rounded-2xl p-6 text-center border border-emerald-100">
        <div className="text-3xl mb-3">🎾🍖</div>
        <p className="text-base font-extrabold text-emerald-900 mb-1">
          다치지 않게 안전한 행테!
        </p>
        <p className="text-sm text-emerald-700">
          저녁에는 함께 바베큐도 즐겨요 🔥
        </p>
      </div>
    </div>
  );
}
