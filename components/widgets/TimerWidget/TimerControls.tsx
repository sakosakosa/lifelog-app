type Props = {
  isRunning: boolean;
  hasSelectedTask: boolean;

  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
};

export default function TimerControls({
  isRunning,
  hasSelectedTask,
  onStart,
  onStop,
  onReset,
}: Props) {
  return (
    <div className="flex shrink-0 justify-center gap-2">

      {/* スタート */}

      <button
        type="button"
        onClick={onStart}
        disabled={
          isRunning ||
          !hasSelectedTask
        }
        className="rounded-md bg-gray-800 px-3 py-1.5 text-xs text-white disabled:opacity-40"
      >
        スタート
      </button>

      {/* ストップ */}

      <button
        type="button"
        onClick={onStop}
        disabled={!isRunning}
        className="rounded-md bg-gray-600 px-3 py-1.5 text-xs text-white disabled:opacity-40"
      >
        ストップ
      </button>

      {/* リセット */}

      <button
        type="button"
        onClick={onReset}
        disabled={isRunning}
        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs disabled:opacity-40"
      >
        リセット
      </button>

    </div>
  );
}