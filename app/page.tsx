"use client";

import { DndContext, pointerWithin } from "@dnd-kit/core";
import { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import Grid from "@/components/Grid";
import ContextMenu from "@/components/ContextMenu";

export default function Home() {

  const [widgetInstances, setWidgetInstances] = useState({});
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    cellIndex: number;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  function handleDragEnd(event: any) {
    //console.log(event.active.data.current);
    const data = event.active.data.current;
    const cellIndex = event.over?.id;

    if (cellIndex == null) return;

    if (data.source === "sidebar") {
      setWidgetInstances((prev) => ({
        ...prev,
        [cellIndex]: {
          id: crypto.randomUUID(),
          type: data.type,
        },
      }));
    } else if (data.source === "grid") {
      setWidgetInstances((prev) => {
        const newWidgetInstances = {
          ...prev,
        };
        delete newWidgetInstances[data.cellIndex];
        newWidgetInstances[cellIndex] = {
          id: event.active.id,
          type: data.type,
        };
        return newWidgetInstances;
      });
    }

  }

  function handleDelete(index: number) {
    setWidgetInstances((prev) => {
      const newWidgetInstances = { ...prev };
      delete newWidgetInstances[index];
      return newWidgetInstances;
    });
  }

  function handleContextMenu(
    x: number,
    y: number,
    cellIndex: number
  ) {
    setContextMenu({
      x,
      y,
      cellIndex,
    });
  }

  function closeContextMenu() {
    setContextMenu(null);
  }

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        menuRef.current &&
        menuRef.current.contains(event.target as Node)
      ) {
        return;
      }

      closeContextMenu();
    }

    if (contextMenu) {
      window.addEventListener("click", handleClick);
    }

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [contextMenu]);

  useEffect(() => {
    if (!isLoaded.current) return;

    localStorage.setItem(
      "widgetInstances",
      JSON.stringify(widgetInstances)
    );
  }, [widgetInstances]);

  useEffect(() => {
    const savedWidgetInstances = localStorage.getItem("widgetInstances");

    if (savedWidgetInstances) {
      setWidgetInstances(JSON.parse(savedWidgetInstances));
    }

    isLoaded.current = true;
  }, []);

  //console.log(widgetInstances);
  return (
    <DndContext
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
    >
      <main className="flex h-screen">
        <Sidebar />
        <Grid
          widgetInstances={widgetInstances}
          onDelete={handleDelete}
          onContextMenu={handleContextMenu}
        />
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            menuRef={menuRef}
            onDelete={() => {
              handleDelete(contextMenu.cellIndex);
              closeContextMenu();
            }}
          />
        )}
      </main>
    </DndContext>
  );
}
