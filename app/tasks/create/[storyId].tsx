import { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import TasksAPI from "@/services/TaskAPI";

export default function TaskCreationPage() {
  const { storyId } = useParams(); // Parametr z URL
  const [task, setTask] = useState({
    name: "",
    description: "",
    priority: "medium",
    estimatedTimeOfCompletion: 0,
    state: "todo",
    responsibleUser: "", // Możesz dodać logikę do przypisywania użytkownika
  });

  const router = useRouter();

  const handleSubmit = () => {
    if (!task.name.trim() || !task.description.trim()) return;

    // Stworzenie zadania przez API
    const newTask = TasksAPI.create(
      task.name,
      task.description,
      task.priority,
      storyId as string,
      task.estimatedTimeOfCompletion,
      task.state,
      task.responsibleUser
    );

    if (newTask) {
      // Przejście do strony historii po dodaniu zadania
      router.push(`/project/${storyId}`);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-900 mb-4">Create Task</h1>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Task Name"
          value={task.name}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <textarea
          placeholder="Task Description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />

        {/* Priority Selection */}
        <select
          value={task.priority}
          onChange={(e) => setTask({ ...task, priority: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* State Selection */}
        <select
          value={task.state}
          onChange={(e) => setTask({ ...task, state: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg"
        >
          <option value="todo">Todo</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-500 text-white p-3 rounded-lg"
        >
          Create Task
        </button>
      </div>
    </div>
  );
}
