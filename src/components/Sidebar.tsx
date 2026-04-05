"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menuItems = [
  { href: "/notices", label: "공지사항", icon: "📋" },
  { href: "/members", label: "회원명단", icon: "👥" },
  { href: "/rules", label: "회칙정보", icon: "📑" },
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
        className={`flex items-center gap-3 px-5 py-3.5 text-sm transition-all duration-200 ${
          isActive
            ? "bg-white/15 text-white font-bold border-l-[3px] border-lime-400"
            : "text-white/70 hover:text-white hover:bg-white/8 border-l-[3px] border-transparent"
        }`}
      >
        <span className="text-base">{item.icon}</span>
        {item.label}
      </Link>
    );
  });

  return (
    <>
      {/* 모바일 상단 헤더 */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-emerald-900 text-white flex items-center justify-between px-4 h-14 shadow-lg">
        <Link href="/" className="text-lg font-extrabold tracking-tight">
          🎾 테왕사신기
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
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
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 모바일 슬라이드 메뉴 */}
      <aside
        className={`md:hidden fixed top-14 left-0 z-50 w-64 bg-emerald-900 h-[calc(100vh-3.5rem)] transition-transform duration-300 ease-out shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="py-6">{navLinks}</nav>
      </aside>

      {/* 데스크탑 사이드바 */}
      <aside className="hidden md:flex w-56 bg-emerald-900 min-h-screen flex-col shrink-0">
        <div className="px-5 py-8">
          <Link href="/" className="block">
            <span className="text-2xl">🎾</span>
            <p className="text-white text-xl font-extrabold tracking-tight mt-1">
              테왕사신기
            </p>
            <p className="text-white/40 text-xs mt-0.5">Tennis Club</p>
          </Link>
        </div>
        <nav className="flex-1 py-2">{navLinks}</nav>
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-white/30 text-[10px]">Est. 2025</p>
        </div>
      </aside>
    </>
  );
}
