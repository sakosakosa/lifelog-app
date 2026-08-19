import type {
  TimerTask,
  TimerSession,
} from "@/types/widgetTypes";
import DraggableCapture from "@/components/widgets/DraggableCapture";
import { formatDuration } from "@/lib/timer/timerUtils";


type HistoryGroup = {
  date: string;
  sessions: TimerSession[];
  totalDuration: number;
};

/* =========================
   Props
========================= */

type Props = {
  /* =========================
     作業
  ========================= */

  timerTasks: TimerTask[];

  /* =========================
     履歴
  ========================= */

  historyTasks: TimerTask[];

  selectedDate: string;

  expandedTaskIds: Set<string>;

  onToggleTaskHistory: (
    taskId: string
  ) => void;

  getHistoryGroups: (
    task: TimerTask
  ) => HistoryGroup[];

  /* =========================
     セッション編集
  ========================= */

  editingSessionId: string | null;

  editingStartTime: string;

  editingEndTime: string;

  setEditingStartTime: (
    value: string
  ) => void;

  setEditingEndTime: (
    value: string
  ) => void;

  onStartEditingSession: (
    session: TimerSession
  ) => void;

  onCancelEditingSession: () => void;

  onSaveEditedSession: (
    taskId: string,
    sessionId: string
  ) => void;

  onDeleteSession: (
    taskId: string,
    sessionId: string
  ) => void;

  /* =========================
     新規記録追加
  ========================= */

  isAddingSession: boolean;

  addingTaskId: string | null;

  newSessionStartTime: string;

  newSessionEndTime: string;

  setAddingTaskId: (
    value: string | null
  ) => void;

  setNewSessionStartTime: (
    value: string
  ) => void;

  setNewSessionEndTime: (
    value: string
  ) => void;

  historyError: string | null;

  onStartAddingSession: () => void;

  onCancelAddingSession: () => void;

  onSaveNewSession: () => void;
};






/* =========================
   TimerHistory
========================= */

export default function TimerHistory({
  timerTasks,
  historyTasks,
  expandedTaskIds,
  onToggleTaskHistory,
  getHistoryGroups,

  editingSessionId,
  editingStartTime,
  editingEndTime,
  setEditingStartTime,
  setEditingEndTime,
  onStartEditingSession,
  onCancelEditingSession,
  onSaveEditedSession,
  onDeleteSession,

  isAddingSession,
  addingTaskId,
  newSessionStartTime,
  newSessionEndTime,
  setAddingTaskId,
  setNewSessionStartTime,
  setNewSessionEndTime,
  historyError,
  onStartAddingSession,
  onCancelAddingSession,
  onSaveNewSession,
}: Props) {
  /* =========================
     時刻表示
  ========================= */

  function formatSessionTime(
    session: TimerSession
  ) {
    const start =
      new Date(
        session.startedAt
      );

    const end =
      new Date(
        session.endedAt
      );

    const startText =
      start.toLocaleTimeString(
        "ja-JP",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );

    const endText =
      end.toLocaleTimeString(
        "ja-JP",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );

    return `${startText} - ${endText}`;
  }

  return (
    <div className="mt-2 min-h-0 flex-1 overflow-y-auto">

      {/* =========================
          履歴タイトル
      ========================= */}

      <div className="mb-1 text-xs font-bold text-gray-600">
        履歴
      </div>

      {/* =========================
          履歴一覧
      ========================= */}

      {historyTasks.length === 0 ? (
        <div className="py-3 text-center text-xs text-gray-400">
          この日の履歴はありません
        </div>
      ) : (
        <div className="space-y-1">

          {historyTasks.map(
            (task) => {
              const isExpanded =
                expandedTaskIds.has(
                  task.id
                );

              const historyGroups =
                getHistoryGroups(
                  task
                );

              if (
                historyGroups.length === 0
              ) {
                return null;
              }

              return (
                <DraggableCapture
                  key={task.id}
                  id={task.id}
                  type="timer"
                >
                  <div
                    className="rounded-md border border-gray-200 bg-white"
                  >

                    {/* =========================
                      大項目
                  ========================= */}

                    <button
                      type="button"
                      onClick={() =>
                        onToggleTaskHistory(
                          task.id
                        )
                      }
                      className="flex w-full items-center justify-between px-2 py-1.5 text-left text-xs font-medium"
                    >
                      <span>
                        {task.taskName}
                      </span>

                      <span>
                        {isExpanded
                          ? "▲"
                          : "▼"}
                      </span>
                    </button>

                    {/* =========================
                      詳細
                  ========================= */}

                    {isExpanded && (
                      <div className="border-t border-gray-100 px-2 py-2">

                        {historyGroups.map(
                          (group) => (
                            <div
                              key={
                                group.date
                              }
                            >

                              {/* =========================
                                日付
                            ========================= */}

                              <div className="flex items-center justify-between text-xs font-medium">

                                <span>
                                  {group.date}
                                </span>

                                <span>
                                  合計{" "}
                                  {formatDuration(
                                    group.totalDuration
                                  )}
                                </span>

                              </div>

                              {/* =========================
                                セッション
                            ========================= */}

                              <div className="mt-1 space-y-1">

                                {group.sessions.map(
                                  (
                                    session
                                  ) => {
                                    const isEditing =
                                      editingSessionId ===
                                      session.id;

                                    return (
                                      <div
                                        key={
                                          session.id
                                        }
                                        className="rounded-md bg-gray-50 p-1.5"
                                      >

                                        {/* =========================
                                          通常表示
                                      ========================= */}

                                        {!isEditing ? (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              onStartEditingSession(
                                                session
                                              )
                                            }
                                            className="flex w-full items-center justify-between text-left text-[11px] text-gray-500 hover:text-gray-800"
                                          >
                                            <span>
                                              {formatSessionTime(
                                                session
                                              )}
                                            </span>

                                            <span>
                                              {formatDuration(
                                                session.duration
                                              )}
                                            </span>
                                          </button>
                                        ) : (

                                          /* =========================
                                             編集中
                                          ========================= */

                                          <div className="space-y-1.5">

                                            {/* =========================
                                              開始
                                          ========================= */}

                                            <div className="flex items-center gap-2">

                                              <label className="w-8 shrink-0 text-[11px] text-gray-500">
                                                開始
                                              </label>

                                              <input
                                                type="time"
                                                value={
                                                  editingStartTime
                                                }
                                                onChange={(e) =>
                                                  setEditingStartTime(
                                                    e.target.value
                                                  )
                                                }
                                                className="min-w-0 flex-1 rounded border border-gray-300 bg-white px-1.5 py-1 text-[11px] outline-none"
                                              />

                                            </div>

                                            {/* =========================
                                              終了
                                          ========================= */}

                                            <div className="flex items-center gap-2">

                                              <label className="w-8 shrink-0 text-[11px] text-gray-500">
                                                終了
                                              </label>

                                              <input
                                                type="time"
                                                value={
                                                  editingEndTime
                                                }
                                                onChange={(e) =>
                                                  setEditingEndTime(
                                                    e.target.value
                                                  )
                                                }
                                                className="min-w-0 flex-1 rounded border border-gray-300 bg-white px-1.5 py-1 text-[11px] outline-none"
                                              />

                                            </div>

                                            {/* =========================
                                              エラー
                                          ========================= */}

                                            {historyError && (
                                              <div className="text-[11px] text-red-500">
                                                {
                                                  historyError
                                                }
                                              </div>
                                            )}

                                            {/* =========================
                                              ボタン
                                          ========================= */}

                                            <div className="flex justify-end gap-1">

                                              <button
                                                type="button"
                                                onClick={
                                                  onCancelEditingSession
                                                }
                                                className="rounded border border-gray-300 bg-white px-2 py-1 text-[11px]"
                                              >
                                                キャンセル
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() =>
                                                  onDeleteSession(
                                                    task.id,
                                                    session.id
                                                  )
                                                }
                                                className="rounded border border-red-200 bg-white px-2 py-1 text-[11px] text-red-500"
                                              >
                                                削除
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() =>
                                                  onSaveEditedSession(
                                                    task.id,
                                                    session.id
                                                  )
                                                }
                                                className="rounded bg-gray-800 px-2 py-1 text-[11px] text-white"
                                              >
                                                保存
                                              </button>

                                            </div>

                                          </div>
                                        )}

                                      </div>
                                    );
                                  }
                                )}

                              </div>

                            </div>
                          )
                        )}

                      </div>
                    )}

                  </div>
                </DraggableCapture>
              );
            }
          )}

        </div>
      )}

      {/* =========================
          記録追加
      ========================= */}

      {isAddingSession ? (

        <div className="mt-2 rounded-md border border-gray-200 bg-white p-2">

          <div className="mb-2 text-[11px] font-medium text-gray-600">
            記録を追加
          </div>

          {/* =========================
              作業名
          ========================= */}

          <div className="mb-2">

            <label className="mb-1 block text-[11px] text-gray-500">
              作業名
            </label>

            <select
              value={
                addingTaskId ?? ""
              }
              onChange={(e) =>
                setAddingTaskId(
                  e.target.value
                )
              }
              className="w-full rounded border border-gray-300 bg-white px-1.5 py-1 text-[11px] outline-none"
            >
              <option value="">
                作業を選択
              </option>

              {timerTasks.map(
                (task) => (
                  <option
                    key={task.id}
                    value={task.id}
                  >
                    {task.taskName}
                  </option>
                )
              )}

            </select>

          </div>

          {/* =========================
              開始
          ========================= */}

          <div className="mb-1.5 flex items-center gap-2">

            <label className="w-8 shrink-0 text-[11px] text-gray-500">
              開始
            </label>

            <input
              type="time"
              value={
                newSessionStartTime
              }
              onChange={(e) =>
                setNewSessionStartTime(
                  e.target.value
                )
              }
              className="min-w-0 flex-1 rounded border border-gray-300 px-1.5 py-1 text-[11px] outline-none"
            />

          </div>

          {/* =========================
              終了
          ========================= */}

          <div className="flex items-center gap-2">

            <label className="w-8 shrink-0 text-[11px] text-gray-500">
              終了
            </label>

            <input
              type="time"
              value={
                newSessionEndTime
              }
              onChange={(e) =>
                setNewSessionEndTime(
                  e.target.value
                )
              }
              className="min-w-0 flex-1 rounded border border-gray-300 px-1.5 py-1 text-[11px] outline-none"
            />

          </div>

          {/* =========================
              エラー
          ========================= */}

          {historyError && (
            <div className="mt-1 text-[11px] text-red-500">
              {historyError}
            </div>
          )}

          {/* =========================
              ボタン
          ========================= */}

          <div className="mt-2 flex justify-end gap-1">

            <button
              type="button"
              onClick={
                onCancelAddingSession
              }
              className="rounded border border-gray-300 bg-white px-2 py-1 text-[11px]"
            >
              キャンセル
            </button>

            <button
              type="button"
              onClick={
                onSaveNewSession
              }
              disabled={
                timerTasks.length === 0
              }
              className="rounded bg-gray-800 px-2 py-1 text-[11px] text-white disabled:opacity-40"
            >
              追加
            </button>

          </div>

        </div>

      ) : (

        /* =========================
           記録追加ボタン
        ========================= */

        <button
          type="button"
          onClick={
            onStartAddingSession
          }
          disabled={
            timerTasks.length === 0
          }
          className="mt-2 w-full rounded border border-dashed border-gray-300 py-1.5 text-[11px] text-gray-500 hover:bg-gray-50 disabled:opacity-40"
        >
          ＋ 記録を追加
        </button>

      )}

    </div>
  );
}