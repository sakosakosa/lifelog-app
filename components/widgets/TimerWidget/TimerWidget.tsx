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

import {
  getDateString,
  formatDuration,
} from "@/lib/timer/timerUtils";

import TimerDisplay from "./TimerDisplay";
import TaskMenu from "./TaskMenu";
import TimerControls from "./TimerControls";
import DateNavigator from "./DateNavigator";
import TimerHistory from "./TimerHistory";

type Props = {
  widget: TimerWidgetInstance;
  timerTasks: TimerTask[];
  onTimerChange: (
    tasks: TimerTask[]
  ) => void;
};

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

    currentStart =
      currentEnd;
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
     作業名編集
  ========================= */

  const [
    editingTaskId,
    setEditingTaskId,
  ] = useState<string | null>(
    null
  );

  const [
    editingTaskName,
    setEditingTaskName,
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
      window.alert(
        "同じ作業名がすでに存在します。"
      );

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
     作業名リネーム開始
  ========================= */

  function startEditingTask(
    task: TimerTask
  ) {
    if (isRunning) {
      return;
    }

    setEditingTaskId(
      task.id
    );

    setEditingTaskName(
      task.taskName
    );

    setNewTaskName("");
  }

  /* =========================
     作業名リネームキャンセル
  ========================= */

  function cancelEditingTask() {
    setEditingTaskId(null);
    setEditingTaskName("");
  }

  /* =========================
     作業名リネーム保存
  ========================= */

  function saveEditedTask() {
    if (!editingTaskId) {
      return;
    }

    const taskName =
      editingTaskName.trim();

    if (!taskName) {
      window.alert(
        "作業名を入力してください。"
      );

      return;
    }

    const alreadyExists =
      timerTasks.some(
        (task) =>
          task.id !== editingTaskId &&
          task.taskName === taskName
      );

    if (alreadyExists) {
      window.alert(
        "同じ作業名がすでに存在します。"
      );

      return;
    }

    const updatedTasks =
      timerTasks.map(
        (task) =>
          task.id === editingTaskId
            ? {
              ...task,
              taskName,
            }
            : task
      );

    onTimerChange(
      updatedTasks
    );

    cancelEditingTask();
  }

  /* =========================
     作業名削除
  ========================= */

  function deleteTask(
    taskId: string
  ) {
    if (isRunning) {
      return;
    }

    const task =
      timerTasks.find(
        (task) =>
          task.id === taskId
      );

    if (!task) {
      return;
    }

    const confirmed =
      window.confirm(
        `「${task.taskName}」を削除しますか？\n\nこの作業の履歴もすべて削除されます。`
      );

    if (!confirmed) {
      return;
    }

    const updatedTasks =
      timerTasks.filter(
        (task) =>
          task.id !== taskId
      );

    onTimerChange(
      updatedTasks
    );

    /* =========================
       削除した作業が
       選択中だった場合
    ========================= */

    if (
      selectedTaskId === taskId
    ) {
      const nextTask =
        updatedTasks[0] ??
        null;

      setSelectedTaskId(
        nextTask?.id ??
        null
      );

      setElapsed(0);

      elapsedBeforeStartRef.current =
        0;

      startedAtRef.current =
        null;
    }

    /* =========================
       履歴の展開状態から削除
    ========================= */

    setExpandedTaskIds(
      (prev) => {
        const next =
          new Set(prev);

        next.delete(taskId);

        return next;
      }
    );

    /* =========================
       編集状態解除
    ========================= */

    if (
      editingTaskId === taskId
    ) {
      cancelEditingTask();
    }

    /* =========================
       記録追加状態解除
    ========================= */

    if (
      addingTaskId === taskId
    ) {
      cancelAddingSession();
    }
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

    setSelectedTaskId(
      taskId
    );

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

    for (
      const session of task.sessions
    ) {
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

      <TaskMenu
        timerTasks={timerTasks}
        selectedTaskId={selectedTaskId}
        isTaskMenuOpen={
          isTaskMenuOpen
        }
        setIsTaskMenuOpen={
          setIsTaskMenuOpen
        }
        newTaskName={
          newTaskName
        }
        setNewTaskName={
          setNewTaskName
        }
        editingTaskId={
          editingTaskId
        }
        editingTaskName={
          editingTaskName
        }
        setEditingTaskName={
          setEditingTaskName
        }
        isRunning={
          isRunning
        }
        onSelectTask={
          selectTask
        }
        onAddTask={
          addTask
        }
        onStartEditingTask={
          startEditingTask
        }
        onCancelEditingTask={
          cancelEditingTask
        }
        onSaveEditedTask={
          saveEditedTask
        }
        onDeleteTask={
          deleteTask
        }
      />

      {/* =========================
          タイマー表示
      ========================= */}

      <TimerDisplay
        elapsed={elapsed}
      />

      {/* =========================
          操作ボタン
      ========================= */}

      <TimerControls
        isRunning={isRunning}
        hasSelectedTask={selectedTask !== null}
        onStart={startTimer}
        onStop={stopTimer}
        onReset={resetTimer}
      />

      {/* =========================
          履歴の日付
      ========================= */}

      <DateNavigator
        selectedDate={selectedDate}
        onChangeDate={changeDate}
        formatDate={formatDate}
      />

      {/* =========================
          履歴
      ========================= */}

      <TimerHistory
        timerTasks={timerTasks}
        historyTasks={historyTasks}
        selectedDate={selectedDate}
        expandedTaskIds={expandedTaskIds}
        onToggleTaskHistory={toggleTaskHistory}
        getHistoryGroups={getHistoryGroups}

        editingSessionId={editingSessionId}
        editingStartTime={editingStartTime}
        editingEndTime={editingEndTime}
        setEditingStartTime={setEditingStartTime}
        setEditingEndTime={setEditingEndTime}
        onStartEditingSession={
          startEditingSession
        }
        onCancelEditingSession={
          cancelEditingSession
        }
        onSaveEditedSession={
          saveEditedSession
        }
        onDeleteSession={
          deleteSession
        }

        isAddingSession={isAddingSession}
        addingTaskId={addingTaskId}
        newSessionStartTime={
          newSessionStartTime
        }
        newSessionEndTime={
          newSessionEndTime
        }
        setAddingTaskId={setAddingTaskId}
        setNewSessionStartTime={
          setNewSessionStartTime
        }
        setNewSessionEndTime={
          setNewSessionEndTime
        }
        historyError={historyError}
        onStartAddingSession={
          startAddingSession
        }
        onCancelAddingSession={
          cancelAddingSession
        }
        onSaveNewSession={
          saveNewSession
        }
      />

    </div>
  );
}