"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Story } from "@/types/story";
import { Task } from "@/types/task";
import StoriesAPI from "@/services/StoriesAPI";
import TaskAPI from "@/services/TaskAPI";

export default function StoryPage() {
  const router = useRouter();
  const params = useParams();
  const { storyId } = params;

  const [story, setStory] = useState<Story | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState(() => ({
    id: "",
    name: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    estimatedTimeOfCompletion: 0,
    state: "todo" as "todo" | "doing" | "done",
    addedDate: "",
    responsibleUser: "",
    storyId: storyId as string,
  }));

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (storyId) {
      const fetchedStory = StoriesAPI.getById(storyId as string);
      setStory(fetchedStory);

      const fetchedTasks = TaskAPI.getByStoryId(storyId as string);
      setTasks(fetchedTasks);
    }
  }, [storyId]);

  const handleCreateTask = () => {
    if (!newTask.name.trim() || !newTask.description.trim()) return;
    if (!story) return;

    const createdTask = TaskAPI.create(
      newTask.name,
      newTask.description,
      newTask.priority,
      story.id,
      newTask.estimatedTimeOfCompletion,
      newTask.state,
      newTask.responsibleUser
    );

    setTasks([...tasks, createdTask]);

    setNewTask({
      id: "",
      name: "",
      description: "",
      priority: "medium",
      estimatedTimeOfCompletion: 0,
      state: "todo",
      addedDate: "",
      responsibleUser: "",
      storyId: story.id,
    });
  };

  if (!story) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-900 mb-4">
        Story Details
      </h1>
      <h2 className="text-2xl font-medium text-gray-800">{story.name}</h2>
      <p className="text-lg text-gray-700 mb-4">{story.description}</p>
      <p className="text-sm text-gray-500">Priority: {story.priority}</p>
      <p className="text-sm text-gray-500">State: {story.state}</p>

      <h3 className="text-xl font-semibold mt-6 text-gray-900">
        Create a Task
      </h3>
      <input
        type="text"
        placeholder="Task Name"
        value={newTask.name}
        onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
        className="block border p-2 w-full text-gray-900"
      />
      <input
        type="text"
        placeholder="Description"
        value={newTask.description}
        onChange={(e) =>
          setNewTask({ ...newTask, description: e.target.value })
        }
        className="block border p-2 w-full mt-2 text-gray-900"
      />
      <select
        value={newTask.priority}
        onChange={(e) =>
          setNewTask({
            ...newTask,
            priority: e.target.value as "low" | "medium" | "high",
          })
        }
        className="block border p-2 w-full mb-2 text-gray-900"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button
        onClick={handleCreateTask}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Task
      </button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="border p-2 my-2 bg-white">
            <p className="text-lg font-medium">{task.name}</p>
            <p className="text-gray-600">{task.description}</p>
            <p className="text-sm text-gray-500">Priority: {task.priority}</p>
            <p className="text-sm text-gray-500">State: {task.state}</p>
            <p className="text-sm text-gray-500">
              Created:{" "}
              {task.addedDate
                ? new Date(task.addedDate).toLocaleDateString()
                : "N/A"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
