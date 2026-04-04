import Link from "next/link";
import type { Notice } from "@/data/notices";

export default function NoticeTable({ notices }: { notices: Notice[] }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-200 text-sm text-gray-700">
          <th className="py-3 px-4 text-left w-16">번호</th>
          <th className="py-3 px-4 text-left">제목</th>
          <th className="py-3 px-4 text-left w-28">작성일</th>
          <th className="py-3 px-4 text-left w-24">작성자</th>
        </tr>
      </thead>
      <tbody>
        {notices.map((notice) => (
          <tr
            key={notice.id}
            className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <td className="py-3 px-4 text-sm text-gray-500">{notice.id}</td>
            <td className="py-3 px-4">
              <Link
                href={`/notices/${notice.id}`}
                className="text-blue-600 hover:underline"
              >
                {notice.title}
              </Link>
            </td>
            <td className="py-3 px-4 text-sm text-gray-500">{notice.date}</td>
            <td className="py-3 px-4 text-sm text-gray-500">
              {notice.author}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
