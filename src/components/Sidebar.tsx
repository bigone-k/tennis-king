"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/notices", label: "공지사항" },
  { href: "/members", label: "회원명단" },
  { href: "/rules", label: "회칙정보" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-gray-900 text-white min-h-screen flex flex-col shrink-0">
      <div className="p-6 border-b border-gray-700">
        <Link href="/" className="text-xl font-bold tracking-wide">
          🎾 테왕사신기
        </Link>
      </div>
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-6 py-3 text-sm transition-colors ${
                isActive
                  ? "bg-gray-700 border-l-4 border-green-400 font-semibold"
                  : "hover:bg-gray-800 border-l-4 border-transparent"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
