"use client";

import { DndContext, pointerWithin } from "@dnd-kit/core";
import { closestCorners } from "@dnd-kit/core";
import { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import Grid1 from "@/components/Grid1";
import ContextMenu from "@/components/ContextMenu";
import { WidgetInstance } from "@/types/widgetTypes";
import { createWidget } from "@/lib/createWidget";

export default function Home() {
  const [widgetInstances, setWidgetInstances] = useState<WidgetInstance[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    X: number;
    Y: number;
    widgetId: string | null; // cellIndex ではなく widgetId を保持
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over) return;

    const { x, y } = over.data.current ?? {};
    if (typeof x !== "number" || typeof y !== "number") return;

    const source = active.data.current?.source;

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

    // セル → セル：既存ウィジェットを移動
    if (source === "grid") {
      const widgetId = active.data.current.widgetId;

      setWidgetInstances((prev) => {
        const isOccupied = prev.some(
          (widget) =>
            widget.id !== widgetId &&
            widget.x === x &&
            widget.y === y
        );

        if (isOccupied) {
          return prev;
        }

        return prev.map((widget) =>
          widget.id === widgetId
            ? { ...widget, x, y }
            : widget
        );
      });
    }
  }

  function handleDelete(id: string) {
    setWidgetInstances((prev) => prev.filter((w) => w.id !== id));
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
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
    >
      <main className="flex h-screen">
        <Sidebar />
        <Grid1
          widgetInstances={widgetInstances}
          onContextMenu={handleContextMenu}
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
