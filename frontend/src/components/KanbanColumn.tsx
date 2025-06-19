import { useDroppable } from "@dnd-kit/core";
import React from "react";
import { ClipboardList, CircleDotDashed, ClipboardCheck } from "lucide-react";

type KanbanColumnProps = {
  col: { key: string; title: string; color: string; icons: string };
  tasks: { id: string; title: string; status: string; color?: string }[];
  children: React.ReactNode;
};

function KanbanColumn({ col, tasks, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: col.key });
  return (
    <div
      ref={setNodeRef}
      id={col.key}
      className={`bg-white shadow min-h-[500px] transition-colors ${
        isOver ? "ring-2 ring-blue-400" : ""
      }`}
    >
      <div
        className={`flex justify-between items-center ${col.color} py-6 px-4`}
      >
        <div className="flex gap-1 items-center">
          {col.icons === "ClipboardList" && (
            <ClipboardList className="text-white w-6 h-6 mr-2" />
          )}

          {col.icons === "CircleDotDashed" && (
            <CircleDotDashed className="text-white w-6 h-6 mr-2" />
          )}

          {col.icons === "ClipboardCheck" && (
            <ClipboardCheck className="text-white w-6 h-6 mr-2" />
          )}

          <h2 className="text-xl font-semibold text-center text-white">
            {col.title}
          </h2>
        </div>
        <span className="rounded-2xl p-1.5 bg-gray-500 text-lg font-medium text-white">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-4 min-h-[200px] p-4">{children}</div>
    </div>
  );
}

export default KanbanColumn;
