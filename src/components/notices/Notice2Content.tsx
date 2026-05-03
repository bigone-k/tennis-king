export default function Notice2Content() {
  return (
    <div className="space-y-8">
      {/* 헤더 배너 */}
      <div className="bg-emerald-900 rounded-2xl p-6 md:p-8 text-white text-center">
        <p className="text-xs font-medium mb-2 text-emerald-300 uppercase tracking-widest">
          NoAD 클럽
        </p>
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
          신규 회원 모집 안내
        </h2>
        <p className="text-sm text-white/60 mt-2">
          함께 테니스를 즐길 새로운 멤버를 찾습니다
        </p>
      </div>

      {/* 1. 모집 방식 */}
      <section>
        <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
            1
          </span>
          모집 방식
        </h3>

        <div className="card p-4 border-l-[3px] border-lime-400 mb-4">
          <p className="font-semibold text-gray-800 text-sm">
            💬 카카오 오픈 채팅방 상설 운영
          </p>
          <p className="text-sm text-gray-500 mt-1">
            &quot;테니스 클럽 회원모집&quot; 오픈 채팅방을 개설하여 상시 모집합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: "🎾", label: "모집 구력", value: "1년 이상 ~ 2년 이하" },
            { icon: "👤", label: "모집 연령", value: "30대 ~ 40대" },
            { icon: "⚡", label: "성별", value: "남/녀 무관" },
          ].map((item) => (
            <div key={item.label} className="card p-4 text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">
                {item.label}
              </p>
              <p className="font-bold text-gray-900 text-sm">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. 신규 회원 클럽 참여 방식 */}
      <section>
        <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
            2
          </span>
          신규 회원 클럽 참여 방식
        </h3>

        <div className="space-y-0">
          {[
            {
              step: 1,
              title: "게스트 참여 신청",
              desc: (
                <>
                  오픈 채팅방에서 클럽 참여를 희망하는 회원을 대상으로, 운영진에서
                  회원 참석 상황에 따라{" "}
                  <span className="font-bold text-emerald-700">
                    1인~2인을 게스트 방식
                  </span>
                  으로 참여시킵니다.
                </>
              ),
            },
            {
              step: 2,
              title: "게스트 참여비 납부",
              desc: (
                <>
                  참여 게스트는 비용{" "}
                  <span className="font-extrabold text-emerald-700 text-base">
                    2만원
                  </span>
                  을 납부합니다.
                </>
              ),
            },
            {
              step: 3,
              title: "가입 여부 결정",
              desc: (
                <>
                  참여한 게스트는 정모 후{" "}
                  <span className="font-bold text-emerald-700">
                    운영진이 협의
                  </span>
                  하여 신규 회원 가입 여부를 결정합니다.
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
      </section>

      {/* 3. 신규 회원 가입비 */}
      <section>
        <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
            3
          </span>
          신규 회원 가입비
        </h3>

        <div className="card p-5 md:p-6">
          <div className="flex items-center justify-center mb-5">
            <div className="bg-emerald-900 text-white rounded-xl px-8 py-4 text-center">
              <p className="text-[11px] text-emerald-300 uppercase tracking-widest mb-1">
                가입비
              </p>
              <p className="text-2xl font-extrabold">10만원 ~ 15만원</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <p>
                가입비는 클럽 정기대관 및 운영비로 활용되며, 클럽에 귀속되는{" "}
                <span className="font-bold text-gray-900">소멸성 비용</span>
                입니다.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <p>
                월 비용 방식은{" "}
                <span className="font-bold text-gray-900">
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
