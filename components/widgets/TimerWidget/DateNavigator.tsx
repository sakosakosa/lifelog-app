type Props = {
  selectedDate: string;
  onChangeDate: (amount: number) => void;
  formatDate: (dateString: string) => string;
};

export default function DateNavigator({
  selectedDate,
  onChangeDate,
  formatDate,
}: Props) {
  return (
    <div className="mt-3 flex shrink-0 items-center justify-center gap-1">

      {/* 前の日 */}

      <button
        type="button"
        onClick={() =>
          onChangeDate(-1)
        }
        className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-200"
      >
        ←
      </button>

      {/* 現在の日付 */}

      <div className="flex h-7 items-center rounded-md px-2 text-xs font-medium">
        📅{" "}
        {formatDate(
          selectedDate
        )}
      </div>

      {/* 次の日 */}

      <button
        type="button"
        onClick={() =>
          onChangeDate(1)
        }
        className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-200"
      >
        →
      </button>

    </div>
  );
}