import Link from "next/link";

const links = [
  {
    title: "회칙정보",
    description: "테왕사신기 클럽 운영 규칙 및 회칙 전문",
    href: "https://docs.google.com/document/d/1X04HC_6oJI-9n8SHEVc4dG0mXa_fkQiZsgTugPKWSXI/edit?tab=t.0#heading=h.svcj8lwqrlaa",
    icon: "📜",
  },
  {
    title: "정산정보",
    description: "클럽 회비 및 코트비 정산 내역",
    href: "https://docs.google.com/spreadsheets/d/1DkCQ40c2YKnrrPX51EjCaPbxANbpMz1DzVpEvkoqYY4/edit?gid=1584736217#gid=1584736217",
    icon: "📊",
  },
];

export default function RulesPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-1">
        회칙정보
      </h1>
      <p className="text-sm text-gray-400 mb-8">
        테왕사신기 클럽 운영에 관한 문서를 확인할 수 있습니다.
      </p>

      <div className="space-y-3">
        {links.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="card card-hover block p-5"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-xl shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-400 mt-0.5">
                  {item.description}
                </p>
              </div>
              <svg
                className="w-4 h-4 text-gray-300 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      <p className="text-[11px] text-gray-300 mt-6 text-center">
        Google Docs / Sheets로 연결됩니다
      </p>
    </div>
  );
}
