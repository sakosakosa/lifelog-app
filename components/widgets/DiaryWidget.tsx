type Props = {
  content: string;
};

export default function DiaryWidget({
  content,
}: Props) {
  return (
    <div className="flex h-full w-full min-h-0 min-w-0 flex-col overflow-hidden bg-yellow-50 p-2">
      <div className="mb-2 shrink-0 text-sm font-bold">
        📒 日記
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto break-words text-xs text-gray-500">
        {content || "（まだ内容はありません）"}
      </div>
    </div>
  );
}