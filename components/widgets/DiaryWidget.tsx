type Props = {
  content: string;
};

export default function DiaryWidget({
  content,
}: Props) {
  return (
    <div className="flex h-full w-full flex-col bg-yellow-50 p-2">
      <div className="mb-2 text-sm font-bold">
        📒 日記
      </div>

      <div className="flex-1 text-xs text-gray-500">
        {content || "（まだ内容はありません）"}
      </div>
    </div>
  );
}