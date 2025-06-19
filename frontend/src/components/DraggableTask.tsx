import { useDraggable } from "@dnd-kit/core";

type DraggableTaskProps = { id: string; title: string; color?: string };

function DraggableTask({ id, title, color }: DraggableTaskProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`rounded p-3 shadow text-gray-800 cursor-move transition-opacity ${
        isDragging ? "opacity-50" : ""
      }`}
      style={{
        background: color || "#93c5fd",
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
    >
      {title}
    </div>
  );
}

export default DraggableTask;
