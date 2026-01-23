import React, { useState, useEffect } from "react";
import { taskAPI } from "../lib/api";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";
import { supabase } from "../lib/supabase";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setError(null);
      const data = await taskAPI.getAll();
      setTasks(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (taskData) => {
    try {
      const newTask = await taskAPI.create(taskData);
      setTasks((prev) => [newTask, ...prev]);
    } catch {
      setError("Failed to create task.");
    }
  };

  const handleUpdate = async (taskData) => {
    try {
      const updatedTask = await taskAPI.update(editingTask.id, taskData);
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
      );
      setEditingTask(null);
    } catch {
      setError("Failed to update task.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await taskAPI.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete task.");
    }
  };

  const handleToggleStatus = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus = task.status === "done" ? "todo" : "done";

    try {
      const updatedTask = await taskAPI.update(id, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
      );
    } catch {
      setError("Failed to update status.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[var(--bg-nav)] flex items-center px-4">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold">To-do List</h1>

          <button
            onClick={handleLogout}
            className="text-sm font-semibold bg-green-600 hover:bg-green-500 px-4 py-1.5 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="pt-20 pb-16 px-4 flex justify-center">
        <div className="w-full max-w-6xl">
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/40 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
            {/* LEFT – FORM */}
            <div className="lg:sticky lg:top-24">
              <TaskForm
                onSubmit={editingTask ? handleUpdate : handleCreate}
                initialData={editingTask || {}}
                onCancel={() => setEditingTask(null)}
                isEditing={!!editingTask}
              />
            </div>

            {/* RIGHT – TODO LIST (CENTRATĂ) */}
            <div className="flex justify-center">
              <div className="w-full max-w-2xl space-y-4">
                {loading && (
                  <div className="text-center py-10 text-sm text-[var(--text-muted)]">
                    Loading…
                  </div>
                )}

                {!loading && tasks.length === 0 && (
                  <div className="bg-custom-card p-6 rounded-lg text-center text-[var(--text-muted)]">
                    No tasks yet.
                  </div>
                )}

                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleStatus}
                    onDelete={handleDelete}
                    onEdit={() => setEditingTask(task)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TaskList;
