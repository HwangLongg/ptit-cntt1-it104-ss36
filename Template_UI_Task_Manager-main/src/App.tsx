import { useEffect, useState } from "react";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  Task,
} from "./api/taskApi";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import FilterControls from "./components/FilterControls";
import ConfirmDialog from "./components/ConfirmDialog";
import { CircularProgress } from "@mui/material";

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "all", priority: "all", search: "" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const res = await getTasks();
    setTasks(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (title: string, priority: "low" | "medium" | "high") => {
    await addTask({ taskName: title, completed: false, priority });
    fetchData();
  };

  const handleToggle = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      await updateTask({ ...task, completed: !task.completed });
      fetchData();
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId !== null) {
      await deleteTask(deleteId);
      fetchData();
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const handleUpdate = async (task: Task) => {
    await updateTask(task);
    setEditingTask(null);
    fetchData();
  };

  const filteredTasks = tasks.filter((t) => {
    const matchStatus =
      filters.status === "all" ||
      (filters.status === "completed" && t.completed) ||
      (filters.status === "active" && !t.completed);

    const matchPriority = filters.priority === "all" || t.priority === filters.priority;
    const matchSearch = t.taskName.toLowerCase().includes(filters.search.toLowerCase());

    return matchStatus && matchPriority && matchSearch;
  });

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">📝 Task Manager</h1>

      <TaskForm
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        editingTask={editingTask}
        tasks={tasks}
      />

      <FilterControls
        status={filters.status}
        priority={filters.priority}
        search={filters.search}
        onStatusChange={(status) => setFilters({ ...filters, status })}
        onPriorityChange={(priority) => setFilters({ ...filters, priority })}
        onSearchChange={(search) => setFilters({ ...filters, search })}
      />

      {loading ? (
        <div className="flex justify-center items-center mt-6">
          <CircularProgress />
        </div>
      ) : (
        <div>
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              {...task}
              onToggle={handleToggle}
              onDelete={handleDeleteClick}
              onEdit={(id) => setEditingTask(tasks.find((t) => t.id === id) || null)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}



export default App;
