export default function Notice3Content() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* 헤더 배너 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-4 md:p-6 text-white text-center">
        <p className="text-sm font-medium mb-1 opacity-90">기존 회원 대상</p>
        <h2 className="text-lg md:text-2xl font-bold mb-2">
          [제안-미결정된내용] 유보금+코트비 or 월 회비 방식 결정
        </h2>
        <p className="text-sm opacity-80">
          회비 운영 방식에 대한 의견을 수렴합니다
        </p>
      </div>

      {/* ==================== 현재 운영 방식 ==================== */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <div className="h-px flex-1 bg-gray-300"></div>
          <span className="px-3 md:px-4 py-1.5 bg-gray-800 text-white text-xs md:text-sm font-bold rounded-full whitespace-nowrap">
            현재 운영 방식
          </span>
          <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        {/* 1. 회비 및 코트 비용 */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold text-sm">
              1
            </span>
            <h3 className="text-base md:text-lg font-bold text-gray-800">
              회비 및 코트 비용
            </h3>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
            <p className="text-sm text-gray-700 mb-4">
              회원들의 월 지출 비용은{" "}
              <span className="font-semibold">회비(3만원)</span> +{" "}
              <span className="font-semibold">참여 정모 코트 비용(1/N)</span>
              으로 구성됩니다.
            </p>

            <div className="bg-gray-50 rounded-lg p-3 md:p-4">
              <p className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-wide">
                월 1회 정모 참석 시 예상 비용
              </p>
              <div className="grid grid-cols-3 gap-1.5 md:gap-2 text-center">
                <div className="bg-white rounded-lg p-2 md:p-3 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">회비</p>
                  <p className="text-base md:text-lg font-bold text-gray-800">
                    3만원
                  </p>
                </div>
                <div className="flex items-center justify-center text-gray-400 text-xl font-light">
                  +
                </div>
                <div className="bg-white rounded-lg p-2 md:p-3 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">1회 코트비</p>
                  <p className="text-base md:text-lg font-bold text-gray-800">
                    2~3만원
                  </p>
                </div>
              </div>
              <div className="mt-3 bg-gray-700 text-white rounded-lg p-3 text-center">
                <p className="text-xs opacity-80 mb-1">월 총 예상 지출</p>
                <p className="text-lg md:text-xl font-bold">5만원 ~ 6만원</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 정기대관 결제 방식 */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold text-sm">
              2
            </span>
            <h3 className="text-base md:text-lg font-bold text-gray-800">
              정기대관 결제 방식
            </h3>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 md:p-5">
            <div className="flex items-start gap-2 mb-4">
              <span className="text-orange-500 text-lg mt-0.5">
                &#9888;&#65039;
              </span>
              <p className="text-sm text-gray-700 font-semibold">
                3개월 코트 대관료가 확보되어야 정기 대관 방식 유지가 가능합니다.
              </p>
            </div>

            <div className="bg-white rounded-lg p-3 md:p-4 space-y-4">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                결제 타임라인 예시
              </p>

              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-orange-200"></div>

                <div className="relative flex items-start gap-3 md:gap-4 mb-4">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold shrink-0 z-10">
                    3월
                  </div>
                  <div className="bg-orange-50 rounded-lg p-2.5 md:p-3 flex-1">
                    <p className="text-sm text-gray-700">
                      3월 코트비 정산 진행
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      4월 15일까지 정산 완료
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start gap-3 md:gap-4 mb-4">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold shrink-0 z-10">
                    3/27
                  </div>
                  <div className="bg-orange-50 rounded-lg p-2.5 md:p-3 flex-1">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">3월 27일(금)</span>에 5월
                      대관료 결제
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      매월 마지막 주 금요일 결제
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start gap-3 md:gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold shrink-0 z-10">
                    &#8721;
                  </div>
                  <div className="bg-orange-100 rounded-lg p-2.5 md:p-3 flex-1 border border-orange-300">
                    <p className="text-sm text-gray-800 font-semibold">
                      3월/4월/5월 &mdash; 3개월치 유보금 필요
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 필요 유보금 및 현황 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold text-sm">
              3
            </span>
            <h3 className="text-base md:text-lg font-bold text-gray-800">
              필요 유보금 및 현황
            </h3>
          </div>

          <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl mb-4">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2.5 md:py-3 px-3 md:px-4 text-left text-gray-600 font-semibold">
                    구분
                  </th>
                  <th className="py-2.5 md:py-3 px-3 md:px-4 text-right text-gray-600 font-semibold">
                    월 4주 적용
                  </th>
                  <th className="py-2.5 md:py-3 px-3 md:px-4 text-right text-gray-600 font-semibold">
                    월 5주 적용
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="py-2.5 md:py-3 px-3 md:px-4 text-gray-700">
                    필요 유보금
                  </td>
                  <td className="py-2.5 md:py-3 px-3 md:px-4 text-right font-semibold text-gray-800">
                    138만원
                  </td>
                  <td className="py-2.5 md:py-3 px-3 md:px-4 text-right font-semibold text-gray-800">
                    174만원
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4">
              <p className="text-xs text-green-600 font-medium mb-1">
                현재 확보 유보금
              </p>
              <p className="text-xl md:text-2xl font-bold text-green-700">
                약 240만원
              </p>
              <p className="text-xs text-gray-500 mt-1">
                4월 MT 비용 제외 기준
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
              <p className="text-xs text-blue-600 font-medium mb-1">
                월 추가 유보금 확보
              </p>
              <p className="text-xl md:text-2xl font-bold text-blue-700">
                약 20만원
              </p>
              <p className="text-xs text-gray-500 mt-1">
                회원 10인 체제 기준
              </p>
            </div>
          </div>

          <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3 md:p-4">
            <p className="text-xs text-gray-500 mb-1">
              월 추가 유보금 산출 근거
            </p>
            <p className="text-sm text-gray-700">
              월회비 3만원 - 캔볼 지원 - 4인 체제 지원금 = 약 20만원 전후
            </p>
          </div>
        </section>
      </div>

      {/* ==================== VS 구분선 ==================== */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-dashed border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 px-4 text-lg font-bold text-gray-400">
            VS
          </span>
        </div>
      </div>

      {/* ==================== 제안하는 방식 ==================== */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <div className="h-px flex-1 bg-indigo-300"></div>
          <span className="px-3 md:px-4 py-1.5 bg-indigo-600 text-white text-xs md:text-sm font-bold rounded-full whitespace-nowrap">
            제안하는 방식 &mdash; 월회비(1/N)
          </span>
          <div className="h-px flex-1 bg-indigo-300"></div>
        </div>

        {/* 방식 설명 */}
        <section className="mb-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 md:p-5">
            <p className="text-sm font-semibold text-indigo-800 mb-3">
              가입비 + 월회비(1/N) 방식의 장점
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">&#10003;</span>
                <p className="text-sm text-gray-700">
                  현재 대부분의 클럽들이 채택하고 있는 방식
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">&#10003;</span>
                <p className="text-sm text-gray-700">
                  회원들의 참석율을 높이고 관리가 용이함
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">&#10003;</span>
                <p className="text-sm text-gray-700">
                  전제 조건: 최소 정기대관 관련 코트 비용이 적립되어야 적용 가능
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2 bg-white rounded-lg p-3 border border-indigo-200">
                <span className="text-indigo-500">&#10148;</span>
                <p className="text-sm text-indigo-700 font-semibold">
                  테왕사신기는 이 조건에 충족됩니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 월회비 비교 테이블 */}
        <section className="mb-6">
          <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl">
            <div className="bg-indigo-600 text-white px-3 md:px-4 py-3">
              <p className="text-xs md:text-sm font-semibold">
                회원 10인 체제 &middot; 월회비(1/N) 방식 적용 시
              </p>
            </div>
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2.5 md:py-3 px-3 md:px-4 text-left text-gray-600 font-semibold">
                    구분
                  </th>
                  <th className="py-2.5 md:py-3 px-3 md:px-4 text-center text-gray-600 font-semibold">
                    월 4주
                  </th>
                  <th className="py-2.5 md:py-3 px-3 md:px-4 text-center text-gray-600 font-semibold">
                    월 5주
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="py-2.5 md:py-3 px-3 md:px-4 text-gray-700">
                    기본 월회비 (1/N)
                  </td>
                  <td className="py-2.5 md:py-3 px-3 md:px-4 text-center font-semibold text-gray-800">
                    46,000원
                  </td>
                  <td className="py-2.5 md:py-3 px-3 md:px-4 text-center font-semibold text-gray-800">
                    58,000원
                  </td>
                </tr>
                <tr className="border-t border-gray-100 bg-indigo-50">
                  <td className="py-2.5 md:py-3 px-3 md:px-4 text-indigo-800 font-semibold">
                    제안 월회비
                    <span className="block text-xs font-normal text-gray-500 mt-0.5">
                      캔볼 + 추가 유보금 포함
                    </span>
                  </td>
                  <td className="py-2.5 md:py-3 px-3 md:px-4 text-center" colSpan={2}>
                    <span className="text-base md:text-lg font-bold text-indigo-700">
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
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-800 text-white px-3 md:px-4 py-3">
              <p className="text-xs md:text-sm font-semibold">
                한눈에 비교 &mdash; 월 1회 참석 기준
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <div className="p-4 md:p-5 text-center">
                <p className="text-xs text-gray-500 font-medium mb-2">
                  현재 방식
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  회비 3만원 + 코트비 1/N
                </p>
                <p className="text-xl md:text-2xl font-bold text-gray-800">
                  5~6만원
                  <span className="text-sm font-normal text-gray-500">
                    /월
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  참석 횟수에 따라 변동
                </p>
              </div>
              <div className="p-4 md:p-5 text-center bg-indigo-50">
                <p className="text-xs text-indigo-600 font-medium mb-2">
                  제안 방식
                </p>
                <p className="text-sm text-indigo-600 mb-1">
                  월회비 1/N 정액제
                </p>
                <p className="text-xl md:text-2xl font-bold text-indigo-700">
                  6만원
                  <span className="text-sm font-normal text-indigo-400">
                    /월
                  </span>
                </p>
                <p className="text-xs text-indigo-400 mt-1">
                  참석 횟수 무관 고정
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 핵심 포인트 */}
        <div className="bg-green-50 border border-green-300 rounded-xl p-4 md:p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">&#128161;</span>
            <div>
              <p className="font-semibold text-green-800 mb-2">핵심 포인트</p>
              <p className="text-sm text-gray-700">
                회원들이{" "}
                <span className="font-bold text-green-700">
                  월 1회만 참석해도
                </span>{" "}
                기존 지출(5~6만원)보다{" "}
                <span className="font-bold text-green-700">
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
