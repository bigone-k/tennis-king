import { notices } from "@/data/notices";
import NoticeTable from "@/components/NoticeTable";

export default function NoticesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
        공지사항
      </h1>
      <NoticeTable notices={notices} />
    </div>
  );
}
