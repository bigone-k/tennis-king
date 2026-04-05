const members = [
  { no: 1, name: "최복수", gender: "M", ntrp: "?" },
  { no: 2, name: "이윤표", gender: "M", ntrp: "?" },
  { no: 3, name: "안종웅", gender: "M", ntrp: "?" },
  { no: 4, name: "정윤영", gender: "M", ntrp: "?" },
  { no: 5, name: "박주영", gender: "M", ntrp: "?" },
  { no: 6, name: "양다영", gender: "F", ntrp: "?" },
  { no: 7, name: "김미란", gender: "F", ntrp: "?" },
  { no: 8, name: "김대일", gender: "M", ntrp: "?" },
  { no: 9, name: "이주영", gender: "F", ntrp: "?" },
  { no: 10, name: "류호정", gender: "M", ntrp: "?" },
];

export default function MembersPage() {
  const maleCount = members.filter((m) => m.gender === "M").length;
  const femaleCount = members.filter((m) => m.gender === "F").length;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          정회원 명단
        </h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-sm text-gray-400">
            총 {members.length}명
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="text-sm text-gray-400">
            남 {maleCount}명 / 여 {femaleCount}명
          </span>
        </div>
      </div>

      {/* 회원 카드 리스트 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {members.map((member) => (
          <div
            key={member.no}
            className="card p-4 flex items-center gap-4"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${
                member.gender === "M"
                  ? "bg-emerald-500"
                  : "bg-teal-400"
              }`}
            >
              {member.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{member.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`text-xs font-medium ${
                    member.gender === "M"
                      ? "text-emerald-600"
                      : "text-teal-500"
                  }`}
                >
                  {member.gender === "M" ? "남" : "여"}
                </span>
                <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                <span className="text-xs text-gray-400">
                  NTRP {member.ntrp === "?" ? "미정" : member.ntrp}
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-300 font-medium">
              #{member.no}
            </span>
          </div>
        ))}
      </div>

      {/* NTRP 안내 */}
      <div className="card p-4 border-l-[3px] border-emerald-400">
        <p className="font-semibold text-gray-800 text-sm mb-1">NTRP 안내</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          NTRP(National Tennis Rating Program)는 테니스 실력을 1.0~7.0 사이의 숫자로 나타내는 등급 체계입니다. 회원 개별 NTRP는 추후 업데이트 예정입니다.
        </p>
      </div>
    </div>
  );
}
