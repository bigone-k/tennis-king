import { notices, getNoticeById } from "@/data/notices";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import Notice1Content from "@/components/notices/Notice1Content";
import Notice2Content from "@/components/notices/Notice2Content";
import Notice3Content from "@/components/notices/Notice3Content";
import Notice4Content from "@/components/notices/Notice4Content";

const richContent: Record<number, ReactNode> = {
  1: <Notice1Content />,
  2: <Notice2Content />,
  3: <Notice3Content />,
  4: <Notice4Content />,
};

export function generateStaticParams() {
  return notices.map((n) => ({ id: String(n.id) }));
}

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const notice = getNoticeById(Number(id));

  if (!notice) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/notices"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-emerald-600 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        목록으로
      </Link>
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
        {notice.title}
      </h1>
      <div className="flex gap-4 text-sm text-gray-400 mb-8">
        <span>{notice.date}</span>
        <span>{notice.author}</span>
      </div>
      <div className="card p-5 md:p-8 leading-relaxed">
        {richContent[notice.id] ?? notice.content}
      </div>
    </div>
  );
}
