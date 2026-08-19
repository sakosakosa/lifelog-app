type Props = {
  id: string;
};

export default function TimerCaptureOverlay({
  id,
}: Props) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-2 shadow-lg">
      <div className="text-xs font-medium">
        Timer Capture
      </div>

      <div className="mt-1 text-[11px] text-gray-500">
        ID: {id}
      </div>
    </div>
  );
}