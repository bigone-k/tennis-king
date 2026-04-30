import Link from "next/link";
import type { Notice } from "@/data/notices";

export default function NoticeTable({ notices }: { notices: Notice[] }) {
  return (
    <div className="space-y-3">
      {notices.map((notice) => (
        <Link
          key={notice.id}
          href={`/notices/${notice.id}`}
          className="card card-hover block p-4 md:p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4 min-w-0">
              <span className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold shrink-0">
                {notice.id}
              </span>
              <div className="min-w-0">
                <p className="text-sm md:text-base font-semibold text-gray-900 truncate">
                  {notice.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 md:hidden">
                  {notice.date}
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center shrink-0 text-xs text-gray-400">
              <span className="w-24 text-right tabular-nums">{notice.date}</span>
              <span className="w-16 text-right">{notice.author}</span>
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
  );
}
