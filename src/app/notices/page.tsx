import { notices } from "@/data/notices";
import NoticeTable from "@/components/NoticeTable";

export default function NoticesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">공지사항</h1>
      <NoticeTable notices={notices} />
    </div>
  );
}
