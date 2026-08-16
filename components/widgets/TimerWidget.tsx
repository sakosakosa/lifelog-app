"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  TimerWidget as TimerWidgetInstance,
  TimerTask,
  TimerSession,
} from "@/types/widgetTypes";

type Props = {
  widget: TimerWidgetInstance;
  timerTasks: TimerTask[];
  onTimerChange: (
    tasks: TimerTask[]
  ) => void;
};

/* =========================
   日付文字列
========================= */

function getDateString(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =========================
   時間表示
========================= */

function formatDuration(
  milliseconds: number
) {
  const totalSeconds = Math.floor(
    milliseconds / 1000
  );

  const hours = Math.floor(
    totalSeconds / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds =
    totalSeconds % 60;

  if (hours > 0) {
    return (
      `${hours}時間 ` +
      `${minutes}分 ` +
      `${seconds}秒`
    );
  }

  if (minutes > 0) {
    return (
      `${minutes}分 ` +
      `${seconds}秒`
    );
  }

  return `${seconds}秒`;
}

/* =========================
   デジタル表示
========================= */

function formatDigitalTime(
  milliseconds: number
) {
  const totalSeconds = Math.floor(
    milliseconds / 1000
  );

  const hours = Math.floor(
    totalSeconds / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds =
    totalSeconds % 60;

  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0")
  );
}

/* =========================
   セッションを日付ごとに分割
========================= */

function splitSessionByDate(
  startTime: number,
  endTime: number
): TimerSession[] {
  const sessions: TimerSession[] = [];

  let currentStart = startTime;

  while (currentStart < endTime) {
    const currentDate =
      new Date(currentStart);

    const nextMidnight =
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1,
        0,
        0,
        0,
        0
      ).getTime();

    const currentEnd =
      Math.min(
        endTime,
        nextMidnight
      );

    sessions.push({
      id: crypto.randomUUID(),

      date:
        getDateString(
          new Date(currentStart)
        ),

      startedAt:
        new Date(
          currentStart
        ).toISOString(),

      endedAt:
        new Date(
          currentEnd
        ).toISOString(),

      duration:
        currentEnd -
        currentStart,
    });

    currentStart = currentEnd;
  }

  return sessions;
}

/* =========================
   履歴の型
========================= */

type HistoryGroup = {
  date: string;
  sessions: TimerSession[];
  totalDuration: number;
};

export default function TimerWidget({
  widget,
  timerTasks,
  onTimerChange,
}: Props) {
  /* =========================
     作業メニュー
  ========================= */

  const [
    isTaskMenuOpen,
    setIsTaskMenuOpen,
  ] = useState(false);

  const [
    newTaskName,
    setNewTaskName,
  ] = useState("");

  /* =========================
     選択中の作業
  ========================= */

  const [
    selectedTaskId,
    setSelectedTaskId,
  ] = useState<string | null>(
    timerTasks[0]?.id ?? null
  );

  /* =========================
     履歴を見る日付
  ========================= */

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(
    getDateString(new Date())
  );

  /* =========================
     履歴の開閉
  ========================= */

  const [
    expandedTaskIds,
    setExpandedTaskIds,
  ] = useState<Set<string>>(
    new Set()
  );

  /* =========================
     編集中のセッション
  ========================= */

  const [
    editingSessionId,
    setEditingSessionId,
  ] = useState<string | null>(
    null
  );

  const [
    editingStartTime,
    setEditingStartTime,
  ] = useState("");

  const [
    editingEndTime,
    setEditingEndTime,
  ] = useState("");

  /* =========================
     新規記録入力
  ========================= */

  const [
    isAddingSession,
    setIsAddingSession,
  ] = useState(false);

  const [
    addingTaskId,
    setAddingTaskId,
  ] = useState<string | null>(
    null
  );

  const [
    newSessionStartTime,
    setNewSessionStartTime,
  ] = useState("");

  const [
    newSessionEndTime,
    setNewSessionEndTime,
  ] = useState("");

  /* =========================
     エラーメッセージ
  ========================= */

  const [
    historyError,
    setHistoryError,
  ] = useState<string | null>(
    null
  );

  /* =========================
     タイマー状態
  ========================= */

  const [
    isRunning,
    setIsRunning,
  ] = useState(false);

  const [
    elapsed,
    setElapsed,
  ] = useState(0);

  const startedAtRef =
    useRef<number | null>(null);

  const elapsedBeforeStartRef =
    useRef(0);

  /* =========================
     現在の作業
  ========================= */

  const selectedTask =
    timerTasks.find(
      (task) =>
        task.id === selectedTaskId
    ) ?? null;

  /* =========================
     日付表示
  ========================= */

  function formatDate(
    dateString: string
  ) {
    const date = new Date(
      `${dateString}T00:00:00`
    );

    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    const weekdays = [
      "日",
      "月",
      "火",
      "水",
      "木",
      "金",
      "土",
    ];

    return (
      `${year}/${month}/${day} ` +
      `(${weekdays[date.getDay()]})`
    );
  }

  /* =========================
     日付変更
  ========================= */

  function changeDate(
    amount: number
  ) {
    const current = new Date(
      `${selectedDate}T00:00:00`
    );

    current.setDate(
      current.getDate() + amount
    );

    setSelectedDate(
      getDateString(current)
    );

    setEditingSessionId(null);
    setIsAddingSession(false);
    setAddingTaskId(null);
    setHistoryError(null);
  }

  /* =========================
     選択した日付に
     履歴がある作業だけ取得
  ========================= */

  const historyTasks =
    timerTasks.filter(
      (task) =>
        task.sessions.some(
          (session) =>
            session.date ===
            selectedDate
        )
    );

  /* =========================
     timerTasks変更時
  ========================= */

  useEffect(() => {
    if (timerTasks.length === 0) {
      setSelectedTaskId(null);
      return;
    }

    const exists =
      timerTasks.some(
        (task) =>
          task.id === selectedTaskId
      );

    if (!exists) {
      setSelectedTaskId(
        timerTasks[0].id
      );
    }
  }, [
    timerTasks,
    selectedTaskId,
  ]);

  /* =========================
     タイマー更新
  ========================= */

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval =
      window.setInterval(() => {
        if (
          startedAtRef.current === null
        ) {
          return;
        }

        const currentElapsed =
          elapsedBeforeStartRef.current +
          (
            Date.now() -
            startedAtRef.current
          );

        setElapsed(
          currentElapsed
        );
      }, 100);

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [isRunning]);

  /* =========================
     作業名追加
  ========================= */

  function addTask() {
    const taskName =
      newTaskName.trim();

    if (!taskName) {
      return;
    }

    const alreadyExists =
      timerTasks.some(
        (task) =>
          task.taskName === taskName
      );

    if (alreadyExists) {
      return;
    }

    const newTask: TimerTask = {
      id: crypto.randomUUID(),
      taskName,
      sessions: [],
    };

    onTimerChange([
      ...timerTasks,
      newTask,
    ]);

    setSelectedTaskId(
      newTask.id
    );

    setNewTaskName("");
  }

  /* =========================
     作業選択
  ========================= */

  function selectTask(
    taskId: string
  ) {
    if (isRunning) {
      return;
    }

    setSelectedTaskId(taskId);

    setElapsed(0);

    elapsedBeforeStartRef.current =
      0;

    startedAtRef.current =
      null;
  }

  /* =========================
     スタート
  ========================= */

  function startTimer() {
    if (!selectedTask) {
      return;
    }

    if (isRunning) {
      return;
    }

    startedAtRef.current =
      Date.now();

    elapsedBeforeStartRef.current =
      elapsed;

    setIsRunning(true);
  }

  /* =========================
     ストップ
  ========================= */

  function stopTimer() {
    if (!isRunning) {
      return;
    }

    if (
      startedAtRef.current === null
    ) {
      return;
    }

    const endTime =
      Date.now();

    const sectionStart =
      startedAtRef.current;

    const sectionDuration =
      endTime -
      sectionStart;

    const finalElapsed =
      elapsedBeforeStartRef.current +
      sectionDuration;

    setElapsed(
      finalElapsed
    );

    setIsRunning(false);

    if (selectedTask) {
      const sessions =
        splitSessionByDate(
          sectionStart,
          endTime
        );

      const updatedTasks =
        timerTasks.map(
          (task) =>
            task.id ===
            selectedTask.id
              ? {
                  ...task,
                  sessions: [
                    ...task.sessions,
                    ...sessions,
                  ],
                }
              : task
        );

      onTimerChange(
        updatedTasks
      );
    }

    elapsedBeforeStartRef.current =
      finalElapsed;

    startedAtRef.current =
      null;
  }

  /* =========================
     リセット
  ========================= */

  function resetTimer() {
    if (isRunning) {
      return;
    }

    setElapsed(0);

    elapsedBeforeStartRef.current =
      0;

    startedAtRef.current =
      null;
  }

  /* =========================
     履歴開閉
  ========================= */

  function toggleTaskHistory(
    taskId: string
  ) {
    setExpandedTaskIds(
      (prev) => {
        const next =
          new Set(prev);

        if (
          next.has(taskId)
        ) {
          next.delete(taskId);
        } else {
          next.add(taskId);
        }

        return next;
      }
    );
  }

  /* =========================
     時刻 → Date
  ========================= */

  function createDateFromTime(
    time: string
  ) {
    return new Date(
      `${selectedDate}T${time}:00`
    );
  }

  /* =========================
     編集開始
  ========================= */

  function startEditingSession(
    session: TimerSession
  ) {
    setHistoryError(null);

    const start =
      new Date(
        session.startedAt
      );

    const end =
      new Date(
        session.endedAt
      );

    setEditingSessionId(
      session.id
    );

    setEditingStartTime(
      `${String(
        start.getHours()
      ).padStart(2, "0")}:${String(
        start.getMinutes()
      ).padStart(2, "0")}`
    );

    setEditingEndTime(
      `${String(
        end.getHours()
      ).padStart(2, "0")}:${String(
        end.getMinutes()
      ).padStart(2, "0")}`
    );

    setIsAddingSession(false);
    setAddingTaskId(null);
  }

  /* =========================
     編集キャンセル
  ========================= */

  function cancelEditingSession() {
    setEditingSessionId(null);
    setEditingStartTime("");
    setEditingEndTime("");
    setHistoryError(null);
  }

  /* =========================
     セッション編集保存
  ========================= */

  function saveEditedSession(
    taskId: string,
    sessionId: string
  ) {
    setHistoryError(null);

    if (
      !editingStartTime ||
      !editingEndTime
    ) {
      setHistoryError(
        "開始時刻と終了時刻を入力してください"
      );

      return;
    }

    const start =
      createDateFromTime(
        editingStartTime
      );

    const end =
      createDateFromTime(
        editingEndTime
      );

    if (
      Number.isNaN(
        start.getTime()
      ) ||
      Number.isNaN(
        end.getTime()
      )
    ) {
      setHistoryError(
        "時刻の形式が正しくありません"
      );

      return;
    }

    if (
      end.getTime() <=
      start.getTime()
    ) {
      setHistoryError(
        "終了時刻は開始時刻より後にしてください"
      );

      return;
    }

    const duration =
      end.getTime() -
      start.getTime();

    const updatedTasks =
      timerTasks.map(
        (task) => {
          if (
            task.id !== taskId
          ) {
            return task;
          }

          return {
            ...task,

            sessions:
              task.sessions.map(
                (session) =>
                  session.id ===
                  sessionId
                    ? {
                        ...session,
                        date:
                          selectedDate,
                        startedAt:
                          start.toISOString(),
                        endedAt:
                          end.toISOString(),
                        duration,
                      }
                    : session
              ),
          };
        }
      );

    onTimerChange(
      updatedTasks
    );

    cancelEditingSession();
  }

  /* =========================
     セッション削除
  ========================= */

  function deleteSession(
    taskId: string,
    sessionId: string
  ) {
    const confirmed =
      window.confirm(
        "この記録を削除しますか？"
      );

    if (!confirmed) {
      return;
    }

    const updatedTasks =
      timerTasks.map(
        (task) => {
          if (
            task.id !== taskId
          ) {
            return task;
          }

          return {
            ...task,

            sessions:
              task.sessions.filter(
                (session) =>
                  session.id !==
                  sessionId
              ),
          };
        }
      );

    onTimerChange(
      updatedTasks
    );

    if (
      editingSessionId ===
      sessionId
    ) {
      cancelEditingSession();
    }
  }

  /* =========================
     新規記録入力開始
  ========================= */

  function startAddingSession() {
    setHistoryError(null);

    setEditingSessionId(null);

    setIsAddingSession(true);

    setAddingTaskId(
      selectedTaskId ??
      timerTasks[0]?.id ??
      null
    );

    setNewSessionStartTime(
      "09:00"
    );

    setNewSessionEndTime(
      "10:00"
    );
  }

  /* =========================
     新規記録キャンセル
  ========================= */

  function cancelAddingSession() {
    setIsAddingSession(false);

    setAddingTaskId(null);

    setNewSessionStartTime("");

    setNewSessionEndTime("");

    setHistoryError(null);
  }

  /* =========================
     新規記録保存
  ========================= */

  function saveNewSession() {
    setHistoryError(null);

    if (!addingTaskId) {
      setHistoryError(
        "作業名を選択してください"
      );

      return;
    }

    if (
      !newSessionStartTime ||
      !newSessionEndTime
    ) {
      setHistoryError(
        "開始時刻と終了時刻を入力してください"
      );

      return;
    }

    const start =
      createDateFromTime(
        newSessionStartTime
      );

    const end =
      createDateFromTime(
        newSessionEndTime
      );

    if (
      Number.isNaN(
        start.getTime()
      ) ||
      Number.isNaN(
        end.getTime()
      )
    ) {
      setHistoryError(
        "時刻の形式が正しくありません"
      );

      return;
    }

    if (
      end.getTime() <=
      start.getTime()
    ) {
      setHistoryError(
        "終了時刻は開始時刻より後にしてください"
      );

      return;
    }

    const sessions =
      splitSessionByDate(
        start.getTime(),
        end.getTime()
      );

    const updatedTasks =
      timerTasks.map(
        (task) =>
          task.id === addingTaskId
            ? {
                ...task,

                sessions: [
                  ...task.sessions,
                  ...sessions,
                ],
              }
            : task
      );

    onTimerChange(
      updatedTasks
    );

    setExpandedTaskIds(
      (prev) => {
        const next =
          new Set(prev);

        next.add(
          addingTaskId
        );

        return next;
      }
    );

    cancelAddingSession();
  }

  /* =========================
     履歴を日付ごとにまとめる
  ========================= */

  function getHistoryGroups(
    task: TimerTask
  ): HistoryGroup[] {
    const groupMap =
      new Map<
        string,
        TimerSession[]
      >();

    for (const session of task.sessions) {
      if (
        session.date !==
        selectedDate
      ) {
        continue;
      }

      const existing =
        groupMap.get(
          session.date
        );

      if (existing) {
        existing.push(
          session
        );
      } else {
        groupMap.set(
          session.date,
          [session]
        );
      }
    }

    return Array.from(
      groupMap.entries()
    )
      .map(
        ([
          date,
          sessions,
        ]) => ({
          date,
          sessions,
          totalDuration:
            sessions.reduce(
              (
                total,
                session
              ) =>
                total +
                session.duration,
              0
            ),
        })
      )
      .sort(
        (a, b) =>
          b.date.localeCompare(
            a.date
          )
      );
  }

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

  /* =========================
     Render
  ========================= */

  return (
    <div className="flex h-full w-full min-h-0 flex-col bg-gray-50 p-3">

      {/* =========================
          タイトル
      ========================= */}

      <div className="shrink-0 text-sm font-bold">
        🕒 タイマー
      </div>

      {/* =========================
          作業名メニュー
      ========================= */}

      <div className="mt-2 shrink-0">

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

        {isTaskMenuOpen && (
          <div className="mt-1 rounded-md border border-gray-300 bg-white p-2">

            {/* 作業一覧 */}

            <div className="mb-2 max-h-32 overflow-y-auto">

              {timerTasks.length ===
              0 ? (
                <div className="py-2 text-center text-xs text-gray-400">
                  作業がありません
                </div>
              ) : (
                timerTasks.map(
                  (task) => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => {
                        selectTask(
                          task.id
                        );

                        setIsTaskMenuOpen(
                          false
                        );
                      }}
                      className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-gray-100"
                    >
                      {task.taskName}
                    </button>
                  )
                )
              )}

            </div>

            {/* 作業追加 */}

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
                    addTask();
                  }
                }}
                placeholder="作業名"
                className="min-w-0 flex-1 rounded-md border border-gray-300 px-2 py-1 text-xs outline-none"
              />

              <button
                type="button"
                onClick={
                  addTask
                }
                className="shrink-0 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-100"
              >
                ＋
              </button>

            </div>

          </div>
        )}

      </div>

      {/* =========================
          タイマー表示
      ========================= */}

      <div className="flex min-h-0 flex-1 items-center justify-center">

        <div className="font-mono text-3xl font-medium tracking-wider">
          {formatDigitalTime(
            elapsed
          )}
        </div>

      </div>

      {/* =========================
          操作ボタン
      ========================= */}

      <div className="flex shrink-0 justify-center gap-2">

        <button
          type="button"
          onClick={
            startTimer
          }
          disabled={
            isRunning ||
            !selectedTask
          }
          className="rounded-md bg-gray-800 px-3 py-1.5 text-xs text-white disabled:opacity-40"
        >
          スタート
        </button>

        <button
          type="button"
          onClick={
            stopTimer
          }
          disabled={
            !isRunning
          }
          className="rounded-md bg-gray-600 px-3 py-1.5 text-xs text-white disabled:opacity-40"
        >
          ストップ
        </button>

        <button
          type="button"
          onClick={
            resetTimer
          }
          disabled={
            isRunning
          }
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs disabled:opacity-40"
        >
          リセット
        </button>

      </div>

      {/* =========================
          履歴の日付
      ========================= */}

      <div className="mt-3 flex shrink-0 items-center justify-center gap-1">

        <button
          type="button"
          onClick={() =>
            changeDate(-1)
          }
          className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-200"
        >
          ←
        </button>

        <div className="flex h-7 items-center rounded-md px-2 text-xs font-medium">
          📅 {formatDate(selectedDate)}
        </div>

        <button
          type="button"
          onClick={() =>
            changeDate(1)
          }
          className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-200"
        >
          →
        </button>

      </div>

      {/* =========================
          履歴
      ========================= */}

      <div className="mt-2 min-h-0 flex-1 overflow-y-auto">

        <div className="mb-1 text-xs font-bold text-gray-600">
          履歴
        </div>

        {historyTasks.length ===
        0 ? (
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

                return (
                  <div
                    key={task.id}
                    className="rounded-md border border-gray-200 bg-white"
                  >

                    {/* 大項目 */}

                    <button
                      type="button"
                      onClick={() =>
                        toggleTaskHistory(
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

                    {/* 小項目 */}

                    {isExpanded && (
                      <div className="border-t border-gray-100 px-2 py-2">

                        {historyGroups.map(
                          (
                            group
                          ) => (
                            <div
                              key={
                                group.date
                              }
                            >

                              {/* 日付 */}

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

                              {/* セッション */}

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

                                        {!isEditing ? (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              startEditingSession(
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
                                          <div className="space-y-1.5">

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

                                            {historyError && (
                                              <div className="text-[11px] text-red-500">
                                                {historyError}
                                              </div>
                                            )}

                                            <div className="flex justify-end gap-1">

                                              <button
                                                type="button"
                                                onClick={
                                                  cancelEditingSession
                                                }
                                                className="rounded border border-gray-300 bg-white px-2 py-1 text-[11px]"
                                              >
                                                キャンセル
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() =>
                                                  deleteSession(
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
                                                  saveEditedSession(
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

            {/* 作業名 */}

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

            {/* 開始 */}

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

            {/* 終了 */}

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

            {historyError && (
              <div className="mt-1 text-[11px] text-red-500">
                {historyError}
              </div>
            )}

            <div className="mt-2 flex justify-end gap-1">

              <button
                type="button"
                onClick={
                  cancelAddingSession
                }
                className="rounded border border-gray-300 bg-white px-2 py-1 text-[11px]"
              >
                キャンセル
              </button>

              <button
                type="button"
                onClick={
                  saveNewSession
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
          <button
            type="button"
            onClick={
              startAddingSession
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

    </div>
  );
}