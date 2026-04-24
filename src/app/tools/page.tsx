import Link from "next/link";

const tools = [
  {
    title: "대진표 생성기",
    description: "참가 인원에 따른 복식 대진표를 자동 생성합니다",
    href: "/tools/match-maker",
    icon: "🎾",
    external: false,
  },
];

export default function ToolsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-1">
        유용한기능
      </h1>
      <p className="text-sm text-gray-400 mb-8">
        클럽 운영에 도움이 되는 다양한 도구를 이용할 수 있습니다.
      </p>

      <div className="space-y-3">
        {tools.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            {...(item.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
