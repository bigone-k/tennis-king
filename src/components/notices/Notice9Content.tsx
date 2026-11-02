type RoleStatus = "유지" | "변경" | "통합" | "폐지";

const roleChanges: {
  name: string;
  before: string;
  after?: string;
  status: RoleStatus;
  note?: string;
}[] = [
  {
    name: "총무",
    before: "회비·모임비용 관리 및 재정 보고",
    after: "회비·모임비용·예산 관리 및 재정 보고",
    status: "변경",
    note: "재정 관리 담당의 예산 관리 업무를 총무가 맡습니다.",
  },
  {
    name: "게임 대진표 담당",
    before: "게임 대진표 작성 및 운영",
    status: "폐지",
  },
  {
    name: "게스트 섭외 담당",
    before: "게스트 초청 및 섭외",
    after: "게스트 초청 및 섭외",
    status: "유지",
  },
  {
    name: "코트 예약 담당",
    before: "코트 예약 및 관리",
    after: "코트 예약 및 관리",
    status: "유지",
  },
  {
    name: "커뮤니케이션·홍보 담당",
    before: "내부 소통 및 활동 홍보",
    after: "내부 소통 및 활동 홍보",
    status: "유지",
  },
  {
    name: "이벤트 기획 담당",
    before: "이벤트 기획 및 운영",
    after: "이벤트 기획 및 운영",
    status: "유지",
  },
  {
    name: "재정 관리 담당",
    before: "예산 및 회계 관리",
    status: "통합",
    note: "총무 역할로 통합합니다.",
  },
  {
    name: "장비 관리 담당",
    before: "테니스 장비 및 코트 정비",
    status: "폐지",
  },
];

const statusStyle: Record<RoleStatus, string> = {
  유지: "bg-gray-100 text-gray-600",
  변경: "bg-emerald-100 text-emerald-700",
  통합: "bg-teal-100 text-teal-700",
  폐지: "bg-rose-100 text-rose-600",
};

const newRoles = [
  { icon: "💰", name: "총무", desc: "회비·모임비용·예산 관리 및 재정 보고" },
  { icon: "🤝", name: "게스트 섭외 담당", desc: "게스트 초청 및 섭외" },
  { icon: "🎾", name: "코트 예약 담당", desc: "코트 예약 및 관리" },
  { icon: "📣", name: "커뮤니케이션·홍보 담당", desc: "내부 소통 및 활동 홍보" },
  { icon: "🎉", name: "이벤트 기획 담당", desc: "이벤트 기획 및 운영" },
];

const assignees = [
  { name: "대일", roles: ["코트 예약", "게스트 섭외"] },
  { name: "덕수", roles: ["커뮤니케이션·홍보", "이벤트 기획"] },
  { name: "호정", roles: ["코트 예약", "이벤트 기획"] },
];

export default function Notice9Content() {
  return (
    <div className="space-y-8">
      {/* 헤더 배너 */}
      <div className="bg-emerald-900 rounded-2xl p-6 md:p-8 text-white text-center">
        <p className="text-xs font-medium mb-2 text-emerald-300 uppercase tracking-widest">
          제8조 운영진 역할 및 구성
        </p>
        <h2 className="text-lg md:text-2xl font-extrabold tracking-tight">
          운영진 역할 변경 안내
        </h2>
        <p className="text-sm text-white/60 mt-2">
          운영진 역할을 8개에서 5개로 정리했습니다
        </p>
      </div>

      {/* 1. 변경 내역 */}
      <section>
        <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
            1
          </span>
          역할별 변경 내역
        </h3>

        <div className="space-y-2">
          {roleChanges.map((role) => (
            <div
              key={role.name}
              className={`card p-4 ${
                role.status === "유지" ? "" : "border-l-[3px] border-emerald-400"
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <p className="font-extrabold text-gray-900 text-sm">
                  {role.name}
                </p>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                    statusStyle[role.status]
                  }`}
                >
                  {role.status}
                </span>
              </div>
              {role.status === "변경" ? (
                <div className="text-sm space-y-0.5">
                  <p className="text-gray-400 line-through">{role.before}</p>
                  <p className="text-emerald-700 font-bold">→ {role.after}</p>
                </div>
              ) : (
                <p
                  className={`text-sm ${
                    role.status === "유지"
                      ? "text-gray-600"
                      : "text-gray-400 line-through"
                  }`}
                >
                  {role.before}
                </p>
              )}
              {role.note && (
                <p className="text-xs text-gray-500 mt-1">{role.note}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 2. 변경 후 운영진 역할 */}
      <section>
        <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
            2
          </span>
          변경 후 운영진 역할
        </h3>

        <div className="card p-5 space-y-3 border-l-[3px] border-emerald-400">
          {newRoles.map((role) => (
            <div key={role.name} className="flex items-start gap-3">
              <span className="text-xl shrink-0">{role.icon}</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">{role.name}</p>
                <p className="text-sm text-gray-600">{role.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 이번 담당자 */}
      <section>
        <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
            3
          </span>
          이번 담당자
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {assignees.map((person) => (
            <div key={person.name} className="card p-4 text-center">
              <p className="text-lg font-extrabold text-gray-900 mb-2">
                {person.name}
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {person.roles.map((r) => (
                  <span
                    key={r}
                    className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 안내 사항 */}
      <div className="card p-5 border-l-[3px] border-amber-400 bg-amber-50/40">
        <p className="font-extrabold text-gray-900 mb-3">📌 안내 사항</p>
        <div className="space-y-2">
          {[
            "게임 대진표 담당과 장비 관리 담당은 폐지합니다.",
            "재정 관리 담당의 예산 관리 업무는 총무가 맡습니다.",
            "역할 관련 문의는 운영진에게 편하게 해 주세요.",
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
