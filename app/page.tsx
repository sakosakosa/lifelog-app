"use client";

import { DndContext } from "@dnd-kit/core";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Grid from "@/components/Grid";

export default function Home() {

  const [placedWidgets, setPlacedWidgets] = useState({});

  function handleDragEnd(event: any) {
    const widgetId = event.active.id;
    const cellIndex = event.over?.id;

    if (cellIndex == null) return;

    setPlacedWidgets((prev) => ({
  ...prev,
  [cellIndex]: widgetId,
}));
  }
  
console.log(placedWidgets);
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <main className="flex h-screen">
        <Sidebar />
        <Grid placedWidgets={placedWidgets} />
      </main>
    </DndContext>
  );
}