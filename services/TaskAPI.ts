import { Task } from "../types/task";

const STORAGE_KEY = "tasks";

const TasksAPI = {
  getAll: (): Task[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Task | null => {
    return TasksAPI.getAll().find((task) => task.id === id) || null;
  },

  getByStoryId: (storyId: string): Task[] => {
    return TasksAPI.getAll().filter((task) => task.storyId === storyId);
  },

  create: (
    name: string,
    description: string,
    priority: "low" | "medium" | "high",
    storyId: string,
    estimatedTimeOfCompletion: number,
    state: "todo" | "doing" | "done",
    responsibleUser: string
  ): Task => {
    const tasks = TasksAPI.getAll();
    const newTask: Task = {
      id: crypto.randomUUID(),
      name,
      description,
      priority,
      storyId,
      estimatedTimeOfCompletion,
      state,
      responsibleUser,
      addedDate: new Date().toISOString(),
      endDate: null,
    };

    tasks.push(newTask);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return newTask;
  },

  update: (
    id: string,
    name: string,
    description: string,
    priority: "low" | "medium" | "high",
    storyId: string,
    estimatedTimeOfCompletion: number,
    state: "todo" | "doing" | "done",
    responsibleUser: string
  ): Task | null => {
    const tasks = TasksAPI.getAll();
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) return null;

    tasks[index] = {
      ...tasks[index],
      name,
      description,
      priority,
      storyId,
      estimatedTimeOfCompletion,
      state,
      responsibleUser,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return tasks[index];
  },

  delete: (id: string): void => {
    const tasks = TasksAPI.getAll().filter((task) => task.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },
};

export default TasksAPI;
