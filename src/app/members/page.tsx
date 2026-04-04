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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white text-center">
        <p className="text-sm font-medium mb-1 opacity-90">
          테왕사신기 클럽
        </p>
        <h2 className="text-2xl font-bold mb-2">정회원 명단</h2>
        <p className="text-sm opacity-80">
          총 {members.length}명 (남 {maleCount}명 / 여 {femaleCount}명)
        </p>
      </div>

      {/* 회원 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                No.
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                이름
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                성별
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                NTRP
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map((member) => (
              <tr key={member.no} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-center text-sm text-gray-500 font-medium">
                  {member.no}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white ${
                        member.gender === "M"
                          ? "bg-blue-400"
                          : "bg-pink-400"
                      }`}
                    >
                      {member.name.charAt(0)}
                    </span>
                    {member.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-sm">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      member.gender === "M"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-pink-100 text-pink-700"
                    }`}
                  >
                    {member.gender === "M" ? "남" : "여"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-400">
                  {member.ntrp === "?" ? (
                    <span className="text-gray-300">미정</span>
                  ) : (
                    <span className="font-semibold text-gray-700">
                      {member.ntrp}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NTRP 안내 */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <span className="text-amber-500 text-lg">&#9889;</span>
          <div>
            <p className="font-semibold text-gray-800 mb-1">NTRP 안내</p>
            <p className="text-sm text-gray-600">
              NTRP(National Tennis Rating Program)는 테니스 실력을 1.0~7.0 사이의 숫자로 나타내는 등급 체계입니다. 회원 개별 NTRP는 추후 업데이트 예정입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
