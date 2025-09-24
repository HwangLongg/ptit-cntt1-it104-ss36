import { Checkbox, Chip, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import React from "react";

interface TaskItemProps {
  id: number;
  taskName: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const priorityColor = {
  low: "success",
  medium: "warning",
  high: "error",
} as const;

const TaskItem: React.FC<TaskItemProps> = ({
  id,
  taskName,
  completed,
  priority,
  onToggle,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm mb-2">
      <div className="flex items-center gap-3">
        <Checkbox checked={completed} onChange={() => onToggle(id)} />
        <span className={`text-sm ${completed ? "line-through text-gray-400" : ""}`}>
          {taskName}
        </span>
        <Chip
          label={priority.toUpperCase()}
          color={priorityColor[priority]}
          size="small"
          className="ml-2"
        />
      </div>
      <div>
        <IconButton onClick={() => onDelete(id)} color="error">
          <Delete />
        </IconButton>
        <IconButton onClick={() => onEdit(id)} color="primary">
          <Edit />
        </IconButton>
      </div>
    </div>
  );
};

export default TaskItem;
