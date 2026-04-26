export default function Notice4Content() {
  return (
    <div className="space-y-8">
      {/* 헤더 배너 */}
      <div className="bg-emerald-900 rounded-2xl p-6 md:p-8 text-white text-center">
        <p className="text-xs font-medium mb-2 text-emerald-300 uppercase tracking-widest">
          전체 회원 대상
        </p>
        <h2 className="text-lg md:text-2xl font-extrabold tracking-tight">
          회비 및 정산 변경안 공지
        </h2>
        <p className="text-sm text-white/60 mt-2">
          시행일: 2026년 5월 1일 회비부터
        </p>
      </div>

      {/* 시행일 강조 카드 */}
      <div className="card p-5 border-l-[3px] border-emerald-400 bg-emerald-50/40">
        <div className="flex items-start gap-3">
          <span className="text-xl">📅</span>
          <div>
            <p className="font-extrabold text-gray-900 mb-1">
              5월 1일 회비부터 적용됩니다
            </p>
            <p className="text-sm text-gray-600">
              모든 회원분들은{" "}
              <span className="font-bold text-emerald-700">
                5월 회비부터 변경된 금액
              </span>
              으로 적용되오니, 시간 되실 때 자동이체 변경 부탁드립니다.
            </p>
          </div>
        </div>
      </div>

      {/* ==================== 기존 운영 방식 ==================== */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="px-4 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-full tracking-wide">
            기존 — 회비 및 정산
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="card p-5 space-y-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-700 text-xs font-bold shrink-0">
              1
            </span>
            <p className="text-sm text-gray-600 leading-relaxed">
              정회원은{" "}
              <span className="font-bold text-gray-900">월 회비 3만원</span>을
              납부하며, 모든 정기 모임에 참여할 경우 다음 달 회비는{" "}
              <span className="font-bold text-gray-900">2만원</span>으로
              감면됩니다.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-700 text-xs font-bold shrink-0">
              2
            </span>
            <p className="text-sm text-gray-600 leading-relaxed">
              모임 중 발생하는{" "}
              <span className="font-bold text-gray-900">게임비와 기타 비용</span>
              은 참석 인원수에 따라{" "}
              <span className="font-bold text-gray-900">1/N</span>로 정산합니다.
            </p>
          </div>
        </div>
      </div>

      {/* ==================== 화살표 구분선 ==================== */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-dashed border-emerald-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-sm font-extrabold text-emerald-500">
            ↓ 변경
          </span>
        </div>
      </div>

      {/* ==================== 변경 운영 방식 ==================== */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-emerald-200" />
          <span className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-full tracking-wide">
            변경 — 회비 및 정산
          </span>
          <div className="h-px flex-1 bg-emerald-200" />
        </div>

        <div className="card p-5 space-y-4 border-l-[3px] border-emerald-400">
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold shrink-0">
              1
            </span>
            <p className="text-sm text-gray-700 leading-relaxed">
              회원 가입 시{" "}
              <span className="font-bold text-emerald-700">
                10만원 입회비
              </span>
              를 납부합니다.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold shrink-0">
              2
            </span>
            <div>
              <p className="text-sm text-gray-700 leading-relaxed">
                정회원{" "}
                <span className="font-bold text-emerald-700">
                  월 회비 6만원
                </span>
                을 납부합니다.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                정기모임 게임비 및 캔볼 사용은 모두 회비에서 진행됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* 변경 후 비용 요약 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="card p-4 border-l-[3px] border-emerald-400">
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-1">
              가입 시 1회
            </p>
            <p className="text-2xl font-extrabold text-emerald-600">10만원</p>
            <p className="text-xs text-gray-400 mt-1">입회비</p>
          </div>
          <div className="card p-4 border-l-[3px] border-teal-400">
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-1">
              매월 정액
            </p>
            <p className="text-2xl font-extrabold text-teal-600">6만원</p>
            <p className="text-xs text-gray-400 mt-1">
              월회비 (게임비·캔볼 포함)
            </p>
          </div>
        </div>
      </div>

      {/* ==================== 안내 사항 ==================== */}
      <div className="card p-5 border-l-[3px] border-amber-400 bg-amber-50/40">
        <p className="font-extrabold text-gray-900 mb-3">📌 안내 사항</p>
        <div className="space-y-2">
          {[
            "모든 회원분들은 5월 회비부터 적용됩니다.",
            "시간 되실 때 자동이체 금액 변경 부탁드립니다.",
            "이전 4월 게임비는 별도로 정산해서 공지드리겠습니다.",
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
