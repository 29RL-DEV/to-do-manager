import React, { useState } from "react";
import "./TaskItem.css";

const TaskItem = ({ task, onToggle, onDelete, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusStyles = {
    todo: "bg-white/5 border-white/10 text-muted",
    "in-progress": "bg-green-500/15 border-green-500/30 text-green-400",
    in_progress: "bg-green-500/15 border-green-500/30 text-green-400",
    done: "bg-green-500/25 border-green-500/40 text-green-300",
  };

  const statusLabels = {
    todo: "📝 To Do",
    "in-progress": "⏳ In Progress",
    in_progress: "⏳ In Progress",
    done: "✅ Completed",
  };

  const formatDateTime = (dateString) => {
    // #format_date
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateStr} at ${timeStr}`;
  };

  const isDone = task.status === "done";

  // #render
  return (
    <div className="taskitem-card">
      <div className="taskitem-container">
        <div className="taskitem-content">
          <input
            type="checkbox"
            checked={isDone}
            disabled
            className="taskitem-checkbox"
            title={isDone ? "Task completed" : "Task not completed yet"}
          />

          <div className="taskitem-content-flex">
            <h3 className={`taskitem-title ${isDone ? "done" : ""}`}>
              {task.title}
            </h3>

            {task.description && (
              <div className="taskitem-description-wrapper">
                <p
                  className={`taskitem-description ${isDone ? "done" : ""} ${
                    isExpanded ? "" : "collapsed"
                  }`}
                >
                  {task.description}
                </p>
                {task.description.length > 150 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="taskitem-expand-btn"
                  >
                    {isExpanded ? "↑ Less" : "↓ More"}
                  </button>
                )}
              </div>
            )}

            <div className="taskitem-meta">
              <span
                className={`taskitem-status-badge taskitem-status-${task.status}`}
              >
                {statusLabels[task.status]}
              </span>

              <span className="taskitem-timestamp">
                <span>🕒</span>
                <span>{formatDateTime(task.created_at)}</span>
                <span className="taskitem-timestamp-hidden">
                  {new Date(task.created_at).toLocaleDateString()}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="taskitem-actions">
          <button
            onClick={() => onEdit()}
            className="taskitem-btn-edit"
            title="Edit this task"
          >
            <span>✏️</span>
            <span className="taskitem-btn-text-hidden">Edit</span>
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="taskitem-btn-delete"
            title="Delete this task"
          >
            <span>🗑️</span>
            <span className="taskitem-btn-text-hidden">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
