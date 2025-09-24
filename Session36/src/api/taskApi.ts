import axios from "axios";

const API_URL = "http://localhost:3000/";

export interface Task {
  id: number;
  taskName: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}
export const getTasks = async () => {
  return { data: [{ id: 1, taskName: "Test task", completed: false, priority: "low" }] };
};

export const addTask = (task: Omit<Task, "id">) => axios.post<Task>(API_URL, task);
export const updateTask = (task: Task) =>
  axios.put<Task>(`${API_URL}/${task.id}`, task);
export const deleteTask = (id: number) => axios.delete(`${API_URL}/${id}`);
