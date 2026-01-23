import React, { useState, useEffect } from "react";
import "./TaskForm.css";

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
    <form onSubmit={handleSubmit} className="taskform">
      <div className="taskform-card">
        <h3 className="taskform-header">
          {isEditing ? "📝 Edit Task" : "➕ Add New Task"}
        </h3>

        {error && <div className="taskform-error">⚠️ {error}</div>}

        {/* TITLE */}
        <div className="taskform-group">
          <label className="taskform-label">Task Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength={200}
            placeholder="What needs to be done?"
            className="taskform-input"
          />
          <p className="taskform-counter">{formData.title.length}/200</p>
        </div>

        {/* DESCRIPTION */}
        <div className="taskform-group">
          <label className="taskform-label">Description (optional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            maxLength={1000}
            placeholder="More details…"
            className="taskform-input taskform-textarea"
          />
          <p className="taskform-counter">{formData.description.length}/1000</p>
        </div>

        {/* STATUS */}
        <div className="taskform-group">
          <label className="taskform-label">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="taskform-select"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Completed</option>
          </select>
        </div>

        {/* ACTIONS */}
        <div className="taskform-actions">
          <button type="submit" className="taskform-btn-submit">
            {isEditing ? "Save Changes" : "Add Task"}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="taskform-btn-cancel"
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
