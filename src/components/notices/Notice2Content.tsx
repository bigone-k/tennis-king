export default function Notice2Content() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* 헤더 배너 */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 md:p-6 text-white text-center">
        <p className="text-sm font-medium mb-1 opacity-90">테왕사신기 클럽</p>
        <h2 className="text-xl md:text-2xl font-bold mb-2">신규 회원 모집 안내</h2>
        <p className="text-sm opacity-80">
          함께 테니스를 즐길 새로운 멤버를 찾습니다
        </p>
      </div>

      {/* 1. 모집 방식 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-sm">
            1
          </span>
          <h3 className="text-base md:text-lg font-bold text-gray-800">모집 방식</h3>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <span className="text-yellow-500 text-lg mt-0.5">&#128172;</span>
            <div>
              <p className="font-semibold text-gray-800 mb-1">카카오 오픈 채팅방 상설 운영</p>
              <p className="text-sm text-gray-600">
                &quot;테니스 클럽 회원모집&quot; 오픈 채팅방을 개설하여 상시 모집합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">&#127934;</div>
            <p className="text-xs text-gray-500 mb-1">모집 구력</p>
            <p className="font-bold text-gray-800">1년 이상 ~ 2년 이하</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">&#128100;</div>
            <p className="text-xs text-gray-500 mb-1">모집 연령</p>
            <p className="font-bold text-gray-800">30대 ~ 40대</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">&#9889;</div>
            <p className="text-xs text-gray-500 mb-1">성별</p>
            <p className="font-bold text-gray-800">남/녀 무관</p>
          </div>
        </div>
      </section>

      {/* 2. 신규 회원 클럽 참여 방식 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
            2
          </span>
          <h3 className="text-base md:text-lg font-bold text-gray-800">
            신규 회원 클럽 참여 방식
          </h3>
        </div>

        {/* 프로세스 플로우 */}
        <div className="space-y-0">
          {/* Step 1 */}
          <div className="flex items-start gap-3 md:gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs md:text-sm shrink-0">
                1
              </div>
              <div className="w-0.5 h-full bg-blue-200 min-h-[40px]"></div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-3 flex-1">
              <p className="font-semibold text-gray-800 mb-1">
                게스트 참여 신청
              </p>
              <p className="text-sm text-gray-600">
                오픈 채팅방에서 클럽 참여를 희망하는 회원을 대상으로, 운영진에서
                회원 참석 상황에 따라{" "}
                <span className="font-semibold text-blue-700">
                  1인~2인을 게스트 방식
                </span>
                으로 참여시킵니다.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 md:gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs md:text-sm shrink-0">
                2
              </div>
              <div className="w-0.5 h-full bg-blue-200 min-h-[40px]"></div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-3 flex-1">
              <p className="font-semibold text-gray-800 mb-1">
                게스트 참여비 납부
              </p>
              <p className="text-sm text-gray-600">
                참여 게스트는 비용{" "}
                <span className="font-bold text-blue-700 text-base">
                  2만원
                </span>
                을 납부합니다.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 md:gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs md:text-sm shrink-0">
                3
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 flex-1">
              <p className="font-semibold text-gray-800 mb-1">
                가입 여부 결정
              </p>
              <p className="text-sm text-gray-600">
                참여한 게스트는 정모 후{" "}
                <span className="font-semibold text-blue-700">
                  운영진이 협의
                </span>
                하여 신규 회원 가입 여부를 결정합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 신규 회원 가입비 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-sm">
            3
          </span>
          <h3 className="text-base md:text-lg font-bold text-gray-800">
            신규 회원 가입비
          </h3>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 md:p-5">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-purple-600 text-white rounded-lg px-6 py-3 text-center">
              <p className="text-xs opacity-80 mb-1">가입비</p>
              <p className="text-xl md:text-2xl font-bold">10만원 ~ 15만원</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5">&#9679;</span>
              <p className="text-sm text-gray-700">
                가입비는 클럽 정기대관 및 운영비로 활용되며, 클럽에 귀속되는{" "}
                <span className="font-semibold text-purple-700">
                  소멸성 비용
                </span>
                입니다.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5">&#9679;</span>
              <p className="text-sm text-gray-700">
                월 비용 방식은{" "}
                <span className="font-semibold">
                  기존 회원들과 상의 후 결정
                </span>
                합니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
