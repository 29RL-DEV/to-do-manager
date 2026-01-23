import React, { useState, useEffect } from "react";
import { taskAPI } from "../lib/api";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";
import { supabase } from "../lib/supabase";
import "./TaskList.css";

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
    <div className="tasklist-container">
      {/* NAVBAR */}
      <header className="tasklist-header">
        <div className="tasklist-nav-inner">
          <h1 className="tasklist-nav-title">📋 To-do List</h1>

          <button onClick={handleLogout} className="tasklist-logout-btn">
            Logout
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="tasklist-main">
        <div className="tasklist-wrapper">
          {error && <div className="tasklist-error-box">{error}</div>}

          <div className="tasklist-grid">
            {/* LEFT – FORM */}
            <div className="tasklist-form-sticky">
              <TaskForm
                onSubmit={editingTask ? handleUpdate : handleCreate}
                initialData={editingTask || {}}
                onCancel={() => setEditingTask(null)}
                isEditing={!!editingTask}
              />
            </div>

            {/* RIGHT – TODO LIST (CENTRATĂ) */}
            <div className="tasklist-tasks-center">
              <div className="tasklist-tasks-wrapper">
                {loading && <div className="tasklist-loading">Loading…</div>}

                {!loading && tasks.length === 0 && (
                  <div className="tasklist-empty">No tasks yet.</div>
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
