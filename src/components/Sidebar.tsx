"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menuItems = [
  { href: "/notices", label: "공지사항" },
  { href: "/members", label: "회원명단" },
  { href: "/rules", label: "회칙정보" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = menuItems.map((item) => {
    const isActive = pathname.startsWith(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setIsOpen(false)}
        className={`block px-6 py-3 text-sm transition-colors ${
          isActive
            ? "bg-gray-700 border-l-4 border-green-400 font-semibold"
            : "hover:bg-gray-800 border-l-4 border-transparent"
        }`}
      >
        {item.label}
      </Link>
    );
  });

  return (
    <>
      {/* 모바일 상단 헤더 */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-gray-900 text-white flex items-center justify-between px-4 h-14">
        <Link href="/" className="text-lg font-bold tracking-wide">
          🎾 테왕사신기
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-gray-800 transition-colors"
          aria-label="메뉴 열기"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </header>

      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 모바일 슬라이드 메뉴 */}
      <aside
        className={`md:hidden fixed top-14 left-0 z-50 w-60 bg-gray-900 text-white h-[calc(100vh-3.5rem)] transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="py-4">{navLinks}</nav>
      </aside>

      {/* 데스크탑 사이드바 */}
      <aside className="hidden md:flex w-60 bg-gray-900 text-white min-h-screen flex-col shrink-0">
        <div className="p-6 border-b border-gray-700">
          <Link href="/" className="text-xl font-bold tracking-wide">
            🎾 테왕사신기
          </Link>
        </div>
        <nav className="flex-1 py-4">{navLinks}</nav>
      </aside>
    </>
  );
}
