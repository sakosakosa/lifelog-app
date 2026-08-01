"use client";

import { DndContext } from "@dnd-kit/core";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Grid from "@/components/Grid";

export default function Home() {

  const [placedWidgets, setPlacedWidgets] = useState({});

  function handleDragEnd(event: any) {
    //console.log(event.active.data.current);
    const data = event.active.data.current;
    const cellIndex = event.over?.id;

    if (cellIndex == null) return;

    if (data.source === "sidebar") {
      setPlacedWidgets((prev) => ({
        ...prev,
        [cellIndex]: {
          id: crypto.randomUUID(),
          type: data.type,
        },
      }));
    } else if (data.source === "grid") {
      setPlacedWidgets((prev) => {
        const newPlacedWidgets = {
          ...prev,
        };
        delete newPlacedWidgets[data.cellIndex];
        newPlacedWidgets[cellIndex] = {
          id: event.active.id,
          type: data.type,
        };
        return newPlacedWidgets;
      });
    }

  }

  //console.log(placedWidgets);
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <main className="flex h-screen">
        <Sidebar />
        <Grid placedWidgets={placedWidgets} />
      </main>
    </DndContext>
  );
}
