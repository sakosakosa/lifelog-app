"use client";

import { DndContext, pointerWithin, type CollisionDetection, } from "@dnd-kit/core";
import { closestCorners } from "@dnd-kit/core";
import type { DragStartEvent, DragMoveEvent, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import Grid1 from "@/components/Grid1";
import ContextMenu from "@/components/ContextMenu";
import { WidgetInstance } from "@/types/widgetTypes";
import { ResizeState } from "@/types/resizeTypes";
import { createWidget } from "@/lib/createWidget";

const collisionDetectionStrategy: CollisionDetection = (args) => {
  const { active, collisionRect, droppableContainers, droppableRects } = args;

  // サイドバーからの追加やリサイズは、ポインタ直下のセルを使う
  if (active.data.current?.source !== "grid") {
    return pointerWithin(args);
  }

  // セルからセルへの移動は、ドラッグ中ウィジェットの左上を使う
  const left = collisionRect.left + 1;
  const top = collisionRect.top + 1;

  const target = droppableContainers.find((container) => {
    const rect = droppableRects.get(container.id);

    return (
      rect &&
      left >= rect.left &&
      left < rect.right &&
      top >= rect.top &&
      top < rect.bottom
    );
  });

  if (!target) return [];

  return [
    {
      id: target.id,
      data: {
        droppableContainer: target,
        value: 1,
      },
    },
  ];
};

export default function Home() {
  const [widgetInstances, setWidgetInstances] = useState<WidgetInstance[]>([]);
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);
  const [resizingWidgetId, setResizingWidgetId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    X: number;
    Y: number;
    widgetId: string | null; // cellIndex ではなく widgetId を保持
  } | null>(null);
  const widgetRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  function isOverlapping(
    targetWidget: WidgetInstance,
    newWidth: number,
    newHeight: number
  ) {
    const targetRight = targetWidget.x + newWidth;
    const targetBottom = targetWidget.y + newHeight;

    return widgetInstances.some((widget) => {
      // 自分自身は判定しない
      if (widget.id === targetWidget.id) {
        return false;
      }

      const widgetRight = widget.x + widget.width;
      const widgetBottom = widget.y + widget.height;

      return (
        targetWidget.x < widgetRight &&
        targetRight > widget.x &&
        targetWidget.y < widgetBottom &&
        targetBottom > widget.y
      );
    });
  }

  function isOutsideGrid(
    widget: WidgetInstance,
    newX: number,
    newY: number
  ) {
    return (
      newX < 0 ||
      newY < 0 ||
      newX + widget.width > 10 ||
      newY + widget.height > 10
    );
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;

    const source = active.data.current?.source;

    if (source !== "resize") {
      return;
    }

    const widgetId = active.data.current?.widgetId;

    if (!widgetId) {
      return;
    }

    const element = widgetRefs.current[widgetId];

    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();

    setResizeState({
      widgetId: widgetId,
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      initialWidth: rect.width,
      initialHeight: rect.height,
    });

    setResizingWidgetId(widgetId);
  }

  function handleDragMove(event: DragMoveEvent) {
    const { active, delta } = event;

    const source = active.data.current?.source;

    if (source !== "resize") {
      return;
    }

    setResizeState((prev) => {
      if (!prev) {
        return null;
      }

      return {
        ...prev,
        width: Math.max(1, prev.initialWidth + delta.x),
        height: Math.max(1, prev.initialHeight + delta.y),
      };
    });
  }


  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    const source = active.data.current?.source;

    // =========================
    // リサイズ終了
    // =========================
    if (source === "resize") {
      const widgetId = active.data.current?.widgetId;

      if (!widgetId || !resizeState) {
        return;
      }

      const element = widgetRefs.current[widgetId];

      if (!element) {
        return;
      }

      const widget = widgetInstances.find(
        (widget) => widget.id === widgetId
      );

      if (!widget) {
        return;
      }

      // WidgetLayerのGridを取得
      const gridElement = element.parentElement?.parentElement;

      if (!gridElement) {
        return;
      }

      // Gridのgapを取得
      const gridStyle = window.getComputedStyle(gridElement);

      const columnGap = parseFloat(gridStyle.columnGap);
      const rowGap = parseFloat(gridStyle.rowGap);

      // リサイズ開始時のWidget幅・高さから
      // 1セルの実寸を計算
      const cellWidth =
        (resizeState.initialWidth -
          columnGap * (widget.width - 1)) /
        widget.width;

      const cellHeight =
        (resizeState.initialHeight -
          rowGap * (widget.height - 1)) /
        widget.height;

      // 最終的なpxサイズからspanを計算
      const newWidth = Math.max(
        1,
        Math.round(
          (resizeState.width + columnGap) /
          (cellWidth + columnGap)
        )
      );

      const newHeight = Math.max(
        1,
        Math.round(
          (resizeState.height + rowGap) /
          (cellHeight + rowGap)
        )
      );

      // Gridからはみ出さないように制限
      const maxWidth = 10 - widget.x;
      const maxHeight = 10 - widget.y;

      const finalWidth = Math.min(
        newWidth,
        maxWidth
      );

      const finalHeight = Math.min(
        newHeight,
        maxHeight
      );

      // 他のWidgetと重複するか確認
      const overlapping = isOverlapping(
        widget,
        finalWidth,
        finalHeight
      );

      if (overlapping) {
        setResizingWidgetId(null);
        setResizeState(null);
        return;
      }

      setWidgetInstances((prev) =>
        prev.map((widget) =>
          widget.id === widgetId
            ? {
              ...widget,
              width: finalWidth,
              height: finalHeight,
            }
            : widget
        )
      );

      // 元Widgetを表示
      setResizingWidgetId(null);

      // Overlayを削除
      setResizeState(null);

      return;
    }

    // =========================
    // ここから通常のDragEnd
    // =========================

    if (!over) {
      return;
    }

    const { x, y } = over.data.current ?? {};

    if (
      typeof x !== "number" ||
      typeof y !== "number"
    ) {
      return;
    }

    // サイドバー → セル：新規作成
    if (source === "sidebar") {
      const widget = createWidget(
        active.data.current.widgetType,
        x,
        y
      );

      setWidgetInstances((prev) => [
        ...prev,
        widget,
      ]);

      return;
    }

    // セル → セル：既存Widgetを移動
    if (source === "grid") {
      const widgetId = active.data.current.widgetId;

      const widget = widgetInstances.find(
        (widget) => widget.id === widgetId
      );

      if (!widget) {
        return;
      }

      // Grid外にはみ出していたらキャンセル
      if (isOutsideGrid(widget, x, y)) {
        return;
      }

      // 他のWidgetと重なっていたらキャンセル
      const isOccupied = isOverlapping(
        {
          ...widget,
          x,
          y,
        },
        widget.width,
        widget.height
      );

      if (isOccupied) {
        return;
      }

      setWidgetInstances((prev) =>
        prev.map((widget) =>
          widget.id === widgetId
            ? {
              ...widget,
              x,
              y,
            }
            : widget
        )
      );

      return;
    }
  }

  function handleDelete(id: string) {
    setWidgetInstances((prev) => prev.filter((w) => w.id !== id));
  }

  function handleWidgetChange(updatedWidget: WidgetInstance) {
    setWidgetInstances((prev) =>
      prev.map((widget) =>
        widget.id === updatedWidget.id
          ? updatedWidget
          : widget
      )
    );
  }

  function handleContextMenu(X: number, Y: number, widgetId: string | null) {
    setContextMenu({ X, Y, widgetId });
  }

  function closeContextMenu() {
    setContextMenu(null);
  }

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (menuRef.current && menuRef.current.contains(event.target as Node)) {
        return;
      }
      closeContextMenu();
    }
    if (contextMenu) {
      window.addEventListener("click", handleClick);
    }
    return () => window.removeEventListener("click", handleClick);
  }, [contextMenu]);

  useEffect(() => {
    if (!isLoaded.current) return;
    localStorage.setItem("widgetInstances", JSON.stringify(widgetInstances));
  }, [widgetInstances]);

  useEffect(() => {
    const saved = localStorage.getItem("widgetInstances");
    if (saved) {
      setWidgetInstances(JSON.parse(saved));
    }
    isLoaded.current = true;
  }, []);

  return (
    <DndContext
      id="main-dnd-context"
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      collisionDetection={collisionDetectionStrategy}
    >
      <main className="flex h-screen">
        <Sidebar />
        <Grid1
          widgetInstances={widgetInstances}
          resizeState={resizeState}
          resizingWidgetId={resizingWidgetId}
          widgetRefs={widgetRefs}
          onContextMenu={handleContextMenu}
          onWidgetChange={handleWidgetChange}
        />
        {contextMenu && (
          <ContextMenu
            X={contextMenu.X}
            Y={contextMenu.Y}
            menuRef={menuRef}
            onDelete={() => {
              if (contextMenu.widgetId) {
                handleDelete(contextMenu.widgetId);
              }
              closeContextMenu();
            }}
          />
        )}
      </main>
    </DndContext>
  );
}
