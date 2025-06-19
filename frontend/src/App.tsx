import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState, useRef } from "react";
import "./App.css";
import KanbanColumn from "./components/KanbanColumn";
import DraggableTask from "./components/DraggableTask";
import CreateTaskButton from "./components/CreateTaskButton";
import { io, Socket } from "socket.io-client";
import { useTaskSocket } from "./hooks/useTaskSocket";
import {
  fetchTasks as fetchTasksApi,
  createTask,
  moveTask,
  updateTask,
} from "./api";
import { LayoutList } from "lucide-react";

const columns = [
  {
    key: "todo",
    title: "To Do",
    color: "bg-blue-500",
    icons: "ClipboardList",
  },
  {
    key: "inprogress",
    title: "In Progress",
    color: "bg-yellow-500",
    icons: "CircleDotDashed",
  },
  {
    key: "done",
    title: "Done",
    color: "bg-green-500",
    icons: "ClipboardCheck",
  },
];

const initialTasks = [
  { id: "1", title: "Task 1", status: "todo", color: "#93c5fd" },
  { id: "2", title: "Task 2", status: "inprogress", color: "#93c5fd" },
  { id: "3", title: "Task 3", status: "done", color: "#93c5fd" },
];

// Skeleton loading component
function CardSkeleton() {
  return (
    <div className="rounded p-3 shadow bg-gray-200 animate-pulse h-16 mb-4" />
  );
}

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));
  const refreshRef = useRef<() => void>(() => {});
  const socketRef = useRef<Socket | null>(null);

  // Fetch tasks from backend API
  async function fetchTasks() {
    setLoading(true);
    try {
      const data = await fetchTasksApi();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
    refreshRef.current = fetchTasks;
  }, []);

  useTaskSocket(fetchTasks);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;
    // ถ้าลากข้าม column
    if (activeTask.status !== over.id) {
      const updatedTask = { ...activeTask, status: over.id as string };
      setTasks((prev) =>
        prev.map((t) => (t.id === active.id ? updatedTask : t))
      );
      moveTask(active.id as string, over.id as string, Date.now())
        .then(() => {
          refreshRef.current();
        })
        .catch(() => {});
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 md:p-12">
      <div className="flex justify-center items-center mb-10">
        <div className="flex items-center space-x-4">
          <LayoutList color="#1447e6" size={30} />
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 tracking-tight text-left md:text-center w-full">
            Real-Time Kanban Board
          </h1>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col) => (
            <SortableContext
              key={col.key}
              items={tasks.filter((t) => t.status === col.key).map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                col={col}
                tasks={tasks.filter((t) => t.status === col.key)}
              >
                <CreateTaskButton
                  onCreate={async (task) => {
                    await createTask(task);
                    refreshRef.current();
                  }}
                />

                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <CardSkeleton key={i} />
                    ))
                  : tasks
                      .filter((t) => t.status === col.key)
                      .map((task) => (
                        <div
                          key={task.id}
                          className="group relative hover:scale-[1.02] transition-transform"
                        >
                          <DraggableTask
                            id={task.id}
                            title={task.title}
                            color={task.color}
                          />
                          <button
                            className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow text-blue-500 opacity-0 group-hover:opacity-100 transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTask(task);
                            }}
                            title="Edit Task"
                          >
                            <svg
                              width="18"
                              height="18"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M15.232 5.232l3.536 3.536M9 13l6.071-6.071a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414 1.414-4.243a4 4 0 01.828-1.414z" />
                            </svg>
                          </button>
                        </div>
                      ))}
              </KanbanColumn>
            </SortableContext>
          ))}
        </div>
      </DndContext>
      {/* Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in border border-blue-100">
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold"
              onClick={() => setSelectedTask(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-700">Edit Task</h2>
            <div className="mb-4">
              <label className="block text-xs font-medium mb-1 text-gray-500">
                Title
              </label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50"
                value={selectedTask.title}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, title: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium mb-1 text-gray-500">
                Description
              </label>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50"
                value={selectedTask.description || ""}
                onChange={(e) =>
                  setSelectedTask({
                    ...selectedTask,
                    description: e.target.value,
                  })
                }
                rows={3}
              />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-medium mb-1 text-gray-500">
                Card Color
              </label>
              <input
                type="color"
                value={selectedTask.color || "#93c5fd"}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, color: e.target.value })
                }
                className="w-12 h-8 p-0 border-none bg-transparent cursor-pointer"
              />
            </div>
            <button
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition"
              onClick={async () => {
                await updateTask(selectedTask.id, {
                  title: selectedTask.title,
                  description: selectedTask.description,
                  color: selectedTask.color,
                });
                setSelectedTask(null);
                refreshRef.current();
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
