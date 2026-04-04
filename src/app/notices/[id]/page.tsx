import { notices, getNoticeById } from "@/data/notices";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import Notice2Content from "@/components/notices/Notice2Content";
import Notice3Content from "@/components/notices/Notice3Content";

const richContent: Record<number, ReactNode> = {
  2: <Notice2Content />,
  3: <Notice3Content />,
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
    <div>
      <Link
        href="/notices"
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block"
      >
        &larr; 목록으로
      </Link>
      <h1 className="text-2xl font-bold mb-2">{notice.title}</h1>
      <div className="flex gap-4 text-sm text-gray-500 mb-6">
        <span>{notice.date}</span>
        <span>{notice.author}</span>
      </div>
      <div className="bg-white rounded-lg p-6 border border-gray-200 leading-relaxed">
        {richContent[notice.id] ?? notice.content}
      </div>
    </div>
  );
}
