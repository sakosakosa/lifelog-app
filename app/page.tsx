"use client";

import { DndContext } from "@dnd-kit/core";
import Sidebar from "@/components/Sidebar";
import Grid from "@/components/Grid";

export default function Home() {
  return (
    <DndContext>
      <main className="flex h-screen">
        <Sidebar />
        <Grid />
      </main>
    </DndContext>
  );
}