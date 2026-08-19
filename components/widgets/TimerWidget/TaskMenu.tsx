import type {
    TimerTask,
} from "@/types/widgetTypes";

type Props = {
    timerTasks: TimerTask[];

    selectedTaskId: string | null;

    isTaskMenuOpen: boolean;
    setIsTaskMenuOpen: (
        value: boolean | ((prev: boolean) => boolean)
    ) => void;

    newTaskName: string;
    setNewTaskName: (
        value: string
    ) => void;

    editingTaskId: string | null;
    editingTaskName: string;
    setEditingTaskName: (
        value: string
    ) => void;

    isRunning: boolean;

    onSelectTask: (
        taskId: string
    ) => void;

    onAddTask: () => void;

    onStartEditingTask: (
        task: TimerTask
    ) => void;

    onCancelEditingTask: () => void;

    onSaveEditedTask: () => void;

    onDeleteTask: (
        taskId: string
    ) => void;
};

export default function TaskMenu({
    timerTasks,
    selectedTaskId,
    isTaskMenuOpen,
    setIsTaskMenuOpen,
    newTaskName,
    setNewTaskName,
    editingTaskId,
    editingTaskName,
    setEditingTaskName,
    isRunning,
    onSelectTask,
    onAddTask,
    onStartEditingTask,
    onCancelEditingTask,
    onSaveEditedTask,
    onDeleteTask,
}: Props) {
    const selectedTask =
        timerTasks.find(
            (task) =>
                task.id === selectedTaskId
        ) ?? null;

    return (
        <div className="mt-2 shrink-0">

            {/* =========================
          作業名ボタン
      ========================= */}

            <button
                type="button"
                onClick={() =>
                    setIsTaskMenuOpen(
                        (prev) => !prev
                    )
                }
                className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs"
            >
                <span>
                    {selectedTask
                        ? selectedTask.taskName
                        : "作業名"}
                </span>

                <span>
                    {isTaskMenuOpen
                        ? "▲"
                        : "▼"}
                </span>
            </button>

            {/* =========================
          メニュー
      ========================= */}

            {isTaskMenuOpen && (
                <div className="mt-1 rounded-md border border-gray-300 bg-white p-2">

                    {/* =========================
              作業一覧
          ========================= */}

                    <div className="mb-2 max-h-32 overflow-y-auto">

                        {timerTasks.length === 0 ? (
                            <div className="py-2 text-center text-xs text-gray-400">
                                作業がありません
                            </div>
                        ) : (
                            timerTasks.map(
                                (task) => {
                                    const isEditing =
                                        editingTaskId ===
                                        task.id;

                                    return (
                                        <div
                                            key={task.id}
                                            className="rounded px-1 py-1 hover:bg-gray-50"
                                        >

                                            {/* =========================
                          リネーム中
                      ========================= */}

                                            {isEditing ? (
                                                <div className="space-y-1">

                                                    <input
                                                        type="text"
                                                        value={
                                                            editingTaskName
                                                        }
                                                        onChange={(e) =>
                                                            setEditingTaskName(
                                                                e.target.value
                                                            )
                                                        }
                                                        onKeyDown={(e) => {
                                                            if (
                                                                e.key ===
                                                                "Enter"
                                                            ) {
                                                                onSaveEditedTask();
                                                            }

                                                            if (
                                                                e.key ===
                                                                "Escape"
                                                            ) {
                                                                onCancelEditingTask();
                                                            }
                                                        }}
                                                        autoFocus
                                                        className="w-full rounded border border-gray-300 px-2 py-1 text-xs outline-none"
                                                    />

                                                    <div className="flex justify-end gap-1">

                                                        <button
                                                            type="button"
                                                            onClick={
                                                                onCancelEditingTask
                                                            }
                                                            className="rounded border border-gray-300 bg-white px-2 py-1 text-[11px]"
                                                        >
                                                            キャンセル
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={
                                                                onSaveEditedTask
                                                            }
                                                            className="rounded bg-gray-800 px-2 py-1 text-[11px] text-white"
                                                        >
                                                            保存
                                                        </button>

                                                    </div>

                                                </div>
                                            ) : (

                                                /* =========================
                                                   通常表示
                                                ========================= */

                                                <div className="flex items-center gap-1">

                                                    {/* 作業選択 */}

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            onSelectTask(
                                                                task.id
                                                            );

                                                            setIsTaskMenuOpen(
                                                                false
                                                            );
                                                        }}
                                                        disabled={
                                                            isRunning
                                                        }
                                                        className="min-w-0 flex-1 truncate rounded px-1 py-1 text-left text-xs hover:bg-gray-100 disabled:opacity-50"
                                                    >
                                                        {
                                                            task.taskName
                                                        }
                                                    </button>

                                                    {/* リネーム */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onStartEditingTask(
                                                                task
                                                            )
                                                        }
                                                        disabled={
                                                            isRunning
                                                        }
                                                        aria-label={`${task.taskName}を編集`}
                                                        className="shrink-0 rounded px-1.5 py-1 text-[11px] text-gray-500 hover:bg-gray-200 disabled:opacity-40"
                                                    >
                                                        ✎
                                                    </button>

                                                    {/* 削除 */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onDeleteTask(
                                                                task.id
                                                            )
                                                        }
                                                        disabled={
                                                            isRunning
                                                        }
                                                        aria-label={`${task.taskName}を削除`}
                                                        className="shrink-0 rounded px-1.5 py-1 text-[11px] text-red-500 hover:bg-red-50 disabled:opacity-40"
                                                    >
                                                        ×
                                                    </button>

                                                </div>
                                            )}

                                        </div>
                                    );
                                }
                            )
                        )}

                    </div>

                    {/* =========================
              作業追加
          ========================= */}

                    <div className="flex gap-1">

                        <input
                            type="text"
                            value={
                                newTaskName
                            }
                            onChange={(e) =>
                                setNewTaskName(
                                    e.target.value
                                )
                            }
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Enter"
                                ) {
                                    onAddTask();
                                }
                            }}
                            placeholder="作業名"
                            className="min-w-0 flex-1 rounded-md border border-gray-300 px-2 py-1 text-xs outline-none"
                        />

                        <button
                            type="button"
                            onClick={
                                onAddTask
                            }
                            className="shrink-0 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-100"
                        >
                            ＋
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}