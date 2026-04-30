import { notices } from "@/data/notices";
import NoticeTable from "@/components/NoticeTable";

export default function NoticesPage() {
  const sortedNotices = [...notices].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return b.id - a.id;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
        공지사항
      </h1>
      <NoticeTable notices={sortedNotices} />
    </div>
  );
}
