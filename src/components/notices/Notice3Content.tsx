export default function Notice3Content() {
  return (
    <div className="space-y-8">
      {/* 헤더 배너 */}
      <div className="bg-emerald-900 rounded-2xl p-6 md:p-8 text-white text-center">
        <p className="text-xs font-medium mb-2 text-emerald-300 uppercase tracking-widest">
          기존 회원 대상
        </p>
        <h2 className="text-lg md:text-2xl font-extrabold tracking-tight">
          [제안-미결정된내용] 유보금+코트비 or 월 회비 방식 결정
        </h2>
        <p className="text-sm text-white/60 mt-2">
          회비 운영 방식에 대한 의견을 수렴합니다
        </p>
      </div>

      {/* ==================== 현재 운영 방식 ==================== */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="px-4 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-full tracking-wide">
            현재 운영 방식
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* 1. 회비 및 코트 비용 */}
        <section className="mb-6">
          <h3 className="text-base font-extrabold text-gray-900 mb-4">
            1. 회비 및 코트 비용
          </h3>

          <div className="card p-5">
            <p className="text-sm text-gray-600 mb-4">
              회원들의 월 지출 비용은{" "}
              <span className="font-bold text-gray-900">회비(3만원)</span> +{" "}
              <span className="font-bold text-gray-900">
                참여 정모 코트 비용(1/N)
              </span>
              으로 구성됩니다.
            </p>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[11px] text-gray-400 font-medium mb-3 uppercase tracking-wider">
                월 1회 정모 참석 시 예상 비용
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-[11px] text-gray-400 mb-1">회비</p>
                  <p className="text-lg font-extrabold text-gray-900">3만원</p>
                </div>
                <div className="flex items-center justify-center text-gray-300 text-xl">
                  +
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-[11px] text-gray-400 mb-1">1회 코트비</p>
                  <p className="text-lg font-extrabold text-gray-900">
                    2~3만원
                  </p>
                </div>
              </div>
              <div className="mt-3 bg-gray-900 text-white rounded-xl p-4 text-center">
                <p className="text-[11px] text-gray-400 mb-1">월 총 예상 지출</p>
                <p className="text-xl font-extrabold">5만원 ~ 6만원</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 정기대관 결제 방식 */}
        <section className="mb-6">
          <h3 className="text-base font-extrabold text-gray-900 mb-4">
            2. 정기대관 결제 방식
          </h3>

          <div className="card p-5 border-l-[3px] border-amber-400">
            <p className="text-sm text-gray-700 font-semibold mb-4">
              ⚠️ 3개월 코트 대관료가 확보되어야 정기 대관 방식 유지가 가능합니다.
            </p>

            <div className="space-y-3">
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                결제 타임라인 예시
              </p>

              {[
                {
                  badge: "3월",
                  text: "3월 코트비 정산 진행",
                  sub: "4월 15일까지 정산 완료",
                },
                {
                  badge: "3/27",
                  text: "3월 27일(금)에 5월 대관료 결제",
                  sub: "매월 마지막 주 금요일 결제",
                },
              ].map((item) => (
                <div key={item.badge} className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-7 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold shrink-0">
                    {item.badge}
                  </span>
                  <div>
                    <p className="text-sm text-gray-700">{item.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}

              <div className="bg-amber-50 rounded-lg p-3 mt-2">
                <p className="text-sm text-gray-800 font-bold">
                  3월/4월/5월 — 3개월치 유보금 필요
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 필요 유보금 및 현황 */}
        <section>
          <h3 className="text-base font-extrabold text-gray-900 mb-4">
            3. 필요 유보금 및 현황
          </h3>

          <div className="card overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-xs text-gray-400 font-semibold">
                    구분
                  </th>
                  <th className="py-3 px-4 text-right text-xs text-gray-400 font-semibold">
                    월 4주 적용
                  </th>
                  <th className="py-3 px-4 text-right text-xs text-gray-400 font-semibold">
                    월 5주 적용
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="py-3 px-4 text-gray-700">필요 유보금</td>
                  <td className="py-3 px-4 text-right font-bold text-gray-900">
                    138만원
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-gray-900">
                    174만원
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="card p-4 border-l-[3px] border-emerald-400">
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-1">
                현재 확보 유보금
              </p>
              <p className="text-2xl font-extrabold text-emerald-600">
                약 240만원
              </p>
              <p className="text-xs text-gray-400 mt-1">
                4월 MT 비용 제외 기준
              </p>
            </div>
            <div className="card p-4 border-l-[3px] border-teal-400">
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-1">
                월 추가 유보금 확보
              </p>
              <p className="text-2xl font-extrabold text-teal-600">
                약 20만원
              </p>
              <p className="text-xs text-gray-400 mt-1">
                회원 10인 체제 기준
              </p>
            </div>
          </div>

          <div className="card p-3 mt-3">
            <p className="text-[11px] text-gray-400 mb-0.5">
              월 추가 유보금 산출 근거
            </p>
            <p className="text-sm text-gray-600">
              월회비 3만원 - 캔볼 지원 - 4인 체제 지원금 = 약 20만원 전후
            </p>
          </div>
        </section>
      </div>

      {/* ==================== VS 구분선 ==================== */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-dashed border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-sm font-extrabold text-gray-300">
            VS
          </span>
        </div>
      </div>

      {/* ==================== 제안하는 방식 ==================== */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-emerald-200" />
          <span className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-full tracking-wide">
            제안하는 방식 — 월회비(1/N)
          </span>
          <div className="h-px flex-1 bg-emerald-200" />
        </div>

        {/* 방식 설명 */}
        <section className="mb-6">
          <div className="card p-5 border-l-[3px] border-emerald-400">
            <p className="text-sm font-bold text-gray-900 mb-3">
              가입비 + 월회비(1/N) 방식의 장점
            </p>
            <div className="space-y-2">
              {[
                "현재 대부분의 클럽들이 채택하고 있는 방식",
                "회원들의 참석율을 높이고 관리가 용이함",
                "전제 조건: 최소 정기대관 관련 코트 비용이 적립되어야 적용 가능",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5 text-sm">✓</span>
                  <p className="text-sm text-gray-600">{text}</p>
                </div>
              ))}
              <div className="bg-emerald-50 rounded-lg p-3 mt-2">
                <p className="text-sm text-emerald-700 font-bold">
                  → NoAD는 이 조건에 충족됩니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 월회비 비교 테이블 */}
        <section className="mb-6">
          <div className="card overflow-hidden">
            <div className="bg-emerald-600 text-white px-4 py-3">
              <p className="text-xs font-bold tracking-wide">
                회원 10인 체제 · 월회비(1/N) 방식 적용 시
              </p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-xs text-gray-400 font-semibold">
                    구분
                  </th>
                  <th className="py-3 px-4 text-center text-xs text-gray-400 font-semibold">
                    월 4주
                  </th>
                  <th className="py-3 px-4 text-center text-xs text-gray-400 font-semibold">
                    월 5주
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="py-3 px-4 text-gray-700">기본 월회비 (1/N)</td>
                  <td className="py-3 px-4 text-center font-bold text-gray-900">
                    46,000원
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-gray-900">
                    58,000원
                  </td>
                </tr>
                <tr className="border-t border-gray-100 bg-emerald-50">
                  <td className="py-3 px-4 text-emerald-800 font-bold">
                    제안 월회비
                    <span className="block text-xs font-normal text-gray-400 mt-0.5">
                      캔볼 + 추가 유보금 포함
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center" colSpan={2}>
                    <span className="text-lg font-extrabold text-emerald-700">
                      60,000원 고정
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 비교 요약 카드 */}
        <section className="mb-6">
          <div className="card overflow-hidden">
            <div className="bg-gray-900 text-white px-4 py-3">
              <p className="text-xs font-bold tracking-wide">
                한눈에 비교 — 월 1회 참석 기준
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              <div className="p-5 text-center">
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-2">
                  현재 방식
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  회비 3만원 + 코트비 1/N
                </p>
                <p className="text-2xl font-extrabold text-gray-900">
                  5~6만원
                  <span className="text-sm font-normal text-gray-400">
                    /월
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  참석 횟수에 따라 변동
                </p>
              </div>
              <div className="p-5 text-center bg-emerald-50/50">
                <p className="text-[11px] text-emerald-600 font-medium uppercase tracking-wider mb-2">
                  제안 방식
                </p>
                <p className="text-sm text-emerald-600 mb-1">
                  월회비 1/N 정액제
                </p>
                <p className="text-2xl font-extrabold text-emerald-700">
                  6만원
                  <span className="text-sm font-normal text-emerald-400">
                    /월
                  </span>
                </p>
                <p className="text-xs text-emerald-400 mt-1">
                  참석 횟수 무관 고정
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 핵심 포인트 */}
        <div className="card p-5 border-l-[3px] border-lime-400 bg-lime-50/30">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <p className="font-extrabold text-gray-900 mb-1">핵심 포인트</p>
              <p className="text-sm text-gray-600">
                회원들이{" "}
                <span className="font-bold text-emerald-700">
                  월 1회만 참석해도
                </span>{" "}
                기존 지출(5~6만원)보다{" "}
                <span className="font-bold text-emerald-700">
                  적거나 같은 비용
                </span>
                으로 운영이 가능합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
