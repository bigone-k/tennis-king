import Link from "next/link";

const links = [
  {
    title: "회칙정보",
    description: "테왕사신기 클럽 운영 규칙 및 회칙 전문",
    href: "https://docs.google.com/document/d/1X04HC_6oJI-9n8SHEVc4dG0mXa_fkQiZsgTugPKWSXI/edit?tab=t.0#heading=h.svcj8lwqrlaa",
    icon: "\u{1F4DC}",
    color: "blue",
  },
  {
    title: "정산정보",
    description: "클럽 회비 및 코트비 정산 내역",
    href: "https://docs.google.com/spreadsheets/d/1DkCQ40c2YKnrrPX51EjCaPbxANbpMz1DzVpEvkoqYY4/edit?gid=1584736217#gid=1584736217",
    icon: "\u{1F4CA}",
    color: "green",
  },
];

const colorMap: Record<string, { bg: string; border: string; iconBg: string; hover: string }> = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
    hover: "hover:border-blue-400 hover:shadow-md",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    iconBg: "bg-green-100",
    hover: "hover:border-green-400 hover:shadow-md",
  },
};

export default function RulesPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">회칙정보</h1>
      <p className="text-sm text-gray-500 mb-8">
        테왕사신기 클럽 운영에 관한 문서를 확인할 수 있습니다.
      </p>

      <div className="space-y-4">
        {links.map((item) => {
          const c = colorMap[item.color];
          return (
            <Link
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`block ${c.bg} border ${c.border} rounded-xl p-5 transition-all ${c.hover}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`${c.iconBg} w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0`}
                >
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {item.description}
                  </p>
                </div>
                <span className="text-gray-400 text-lg shrink-0">
                  &#8599;
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-6 text-center">
        Google Docs / Sheets로 연결됩니다.
      </p>
    </div>
  );
}
