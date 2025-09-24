import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Task } from "../api/taskApi";

interface TaskFormProps {
  onAdd: (title: string, priority: "low" | "medium" | "high") => void;
  onUpdate: (task: Task) => void;
  editingTask: Task | null;
  tasks: Task[];
}

const TaskForm: React.FC<TaskFormProps> = ({
  onAdd,
  onUpdate,
  editingTask,
  tasks,
}) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.taskName);
      setPriority(editingTask.priority);
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Tên công việc không được để trống");
      return;
    }
    if (tasks.some((t) => t.taskName === title && t.id !== editingTask?.id)) {
      alert("Tên công việc không được trùng");
      return;
    }
    if (!priority) {
      alert("Phải chọn độ ưu tiên");
      return;
    }

    if (editingTask) {
      onUpdate({ ...editingTask, taskName: title, priority });
    } else {
      onAdd(title, priority);
    }

    setTitle("");
    setPriority("medium");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-md"
    >
      <TextField
        label="Công việc mới"
        variant="outlined"
        size="small"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1"
        inputRef={inputRef}
      />
      <FormControl size="small" className="w-36">
        <InputLabel>Ưu tiên</InputLabel>
        <Select
          value={priority}
          onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
          label="Ưu tiên"
        >
          <MenuItem value="low">Thấp</MenuItem>
          <MenuItem value="medium">Trung bình</MenuItem>
          <MenuItem value="high">Cao</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        {editingTask ? "Cập nhật" : "Thêm"}
      </Button>
    </form>
  );
};

export default TaskForm;
