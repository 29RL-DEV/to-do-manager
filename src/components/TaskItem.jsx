import React, { useState } from "react";

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
    <div className="bg-custom-card backdrop-blur-xl rounded-2xl p-3 sm:p-6 border border-custom min-w-0 overflow-hidden break-words">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-2 sm:gap-4 flex-1 min-w-0 w-full">
          <input
            type="checkbox"
            checked={isDone}
            disabled
            className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 sm:mt-1 accent-green-400 opacity-60 cursor-not-allowed flex-shrink-0"
            title={isDone ? "Task completed" : "Task not completed yet"}
          />

          <div className="flex-1 min-w-0">
            <h3
              className={`text-base sm:text-lg font-semibold break-words transition ${
                isDone ? "line-through text-muted" : "text-custom"
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <div>
                <p
                  className={`text-xs sm:text-sm mt-1 sm:mt-2 break-words leading-relaxed ${
                    isExpanded ? "" : "line-clamp-3"
                  } ${isDone ? "text-muted" : "text-muted"}`}
                >
                  {task.description}
                </p>
                {task.description.length > 150 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs mt-1 sm:mt-2 text-green-400 hover:text-green-300 font-semibold transition"
                  >
                    {isExpanded ? "↑ Less" : "↓ More"}
                  </button>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-4">
              <span
                className={`text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border ${
                  statusStyles[task.status]
                }`}
              >
                {statusLabels[task.status]}
              </span>

              <span className="text-xs text-muted flex items-center gap-1">
                <span>🕒</span>
                <span className="hidden sm:inline">
                  {formatDateTime(task.created_at)}
                </span>
                <span className="sm:hidden">
                  {new Date(task.created_at).toLocaleDateString()}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-1 sm:gap-2 flex-shrink-0 w-full sm:w-auto">
          <button
            onClick={() => onEdit()}
            className="flex-1 sm:flex-initial px-2 sm:px-4 py-1.5 sm:py-2 bg-green-500 hover:bg-green-600 text-green-950 rounded-lg transition font-medium text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-1 sm:gap-2 shadow-md hover:shadow-lg whitespace-nowrap"
            title="Edit this task"
          >
            <span>✏️</span>
            <span className="hidden sm:inline">Edit</span>
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="flex-1 sm:flex-initial px-2 sm:px-4 py-1.5 sm:py-2 bg-green-700 hover:bg-green-800 text-green-100 rounded-lg transition font-medium text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-1 sm:gap-2 shadow-md hover:shadow-lg whitespace-nowrap"
            title="Delete this task"
          >
            <span>🗑️</span>
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
