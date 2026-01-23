import React, { useState, useEffect } from "react";

const TaskForm = ({
  onSubmit,
  initialData = {},
  onCancel,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    setFormData({
      title: initialData.title || "",
      description: initialData.description || "",
      status: initialData.status || "todo",
    });
    setError("");
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Task title is required");
      return;
    }

    if (formData.title.length > 200) {
      setError("Title must be under 200 characters");
      return;
    }

    if (formData.description.length > 1000) {
      setError("Description must be under 1000 characters");
      return;
    }

    onSubmit(formData);

    if (!isEditing) {
      setFormData({ title: "", description: "", status: "todo" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="bg-custom-card shadow-md">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-custom">
          {isEditing ? "📝 Edit Task" : "➕ Add New Task"}
        </h3>

        {error && (
          <div className="mb-3 rounded-lg border border-red-500 bg-red-500/20 px-3 py-2 text-sm text-red-200">
            ⚠️ {error}
          </div>
        )}

        {/* TITLE */}
        <div className="mb-3">
          <label className="block text-sm text-muted mb-1">Task Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength={200}
            placeholder="What needs to be done?"
            className="w-full rounded-lg border border-custom bg-custom-card px-3 py-2 text-custom focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <p className="text-xs text-muted mt-1">{formData.title.length}/200</p>
        </div>

        {/* DESCRIPTION */}
        <div className="mb-3">
          <label className="block text-sm text-muted mb-1">
            Description (optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            maxLength={1000}
            placeholder="More details…"
            className="w-full resize-none rounded-lg border border-custom bg-custom-card px-3 py-2 text-custom focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <p className="text-xs text-muted mt-1">
            {formData.description.length}/1000
          </p>
        </div>

        {/* STATUS */}
        <div className="mb-4">
          <label className="block text-sm text-muted mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-custom bg-custom-card px-3 py-2 text-custom focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Completed</option>
          </select>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-green-600 py-2 font-semibold text-white transition hover:bg-green-700"
          >
            {isEditing ? "Save Changes" : "Add Task"}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-lg bg-gray-600 py-2 font-semibold text-white transition hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default TaskForm;
