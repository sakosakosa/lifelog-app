"use client";

import { DndContext } from "@dnd-kit/core";
import Sidebar from "@/components/Sidebar";
import Grid from "@/components/Grid";

export default function Home() {

    function handleDragEnd(event: any) {
    console.log(event);
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      onDragEnd={handleDragEnd}
      <main className="flex h-screen">
        <Sidebar />
        <Grid />
      </main>
    </DndContext>
  );
}