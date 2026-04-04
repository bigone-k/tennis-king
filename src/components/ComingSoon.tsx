export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-gray-500 text-lg">개발 예정입니다.</p>
    </div>
  );
}
