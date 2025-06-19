import { useState } from "react";

export type NewTask = {
  title: string;
  description: string;
  color: string;
};

type CreateTaskButtonProps = {
  onCreate: (task: NewTask) => void;
};

function CreateTaskButton({
  onCreate,
  loading = false,
}: CreateTaskButtonProps & { loading?: boolean }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#93c5fd"); // default blue

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title, description, color });
    setTitle("");
    setDescription("");
    setColor("#93c5fd");
    setOpen(false);
  }

  return (
    <div className="mb-4 flex justify-center">
      <button
        className="w-full bg-transparent border-dotted text-gray-700 px-4 py-2 rounded hover:bg-gray-100 transition-colors border border-gray-300 shadow-sm font-semibold text-sm flex items-center gap-2 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        + Create Task
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form
            className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in border border-blue-100"
            onSubmit={handleSubmit}
          >
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              Create Task
            </h2>
            <div className="mb-4">
              <label className="block text-xs font-medium mb-1 text-gray-500">
                Title
              </label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium mb-1 text-gray-500">
                Description
              </label>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-medium mb-1 text-gray-500">
                Card Color
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-8 p-0 border-none bg-transparent cursor-pointer"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition"
            >
              Create
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default CreateTaskButton;
