"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // useRouter added
import { Project } from "../../../types/project";
import ProjectAPI from "../../../services/ProjectAPI";
import { Story } from "@/types/story";
import StoriesAPI from "@/services/StoriesAPI";
import { UserMenager } from "../../../services/UserMenager";

export default function ProjectStoriesPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);
  const [newStory, setNewStory] = useState({
    name: "",
    description: "",
    priority: "medium",
    state: "todo",
    owner: "",
  });

  // Edit state management
  const [editMode, setEditMode] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    if (id) {
      // Fetch project by ID using ProjectAPI
      const fetchedProject = ProjectAPI.getById(id as string);
      setProject(fetchedProject);

      // Fetch stories associated with the project using StoriesAPI
      const projectStories = StoriesAPI.getAll().filter(
        (story) => story.projectId === id
      );
      setStories(projectStories);

      setLoading(false);
    }

    const user = UserMenager.getLoggedInUser();
    if (user) {
      setNewStory((prevStory) => ({
        ...prevStory,
        owner: user.id,
      }));
    }
  }, [id]);

  const addStory = () => {
    if (!newStory.name.trim() || !newStory.description.trim()) return;

    if (!newStory.owner) {
      alert("User is not authenticated.");
      return;
    }

    const story = StoriesAPI.create(
      newStory.name,
      newStory.description,
      newStory.priority as "low" | "medium" | "high",
      id as string,
      new Date(),
      newStory.state as "todo" | "doing" | "done",
      newStory.owner
    );

    setStories((prevStories) => [...prevStories, story]);
    setNewStory({
      name: "",
      description: "",
      priority: "medium",
      state: "todo",
      owner: newStory.owner,
    });
  };

  const deleteStory = (storyId: string) => {
    StoriesAPI.delete(storyId); // Delete story using StoriesAPI
    setStories((prevStories) =>
      prevStories.filter((story) => story.id !== storyId)
    ); // Update local state
  };

  const editStory = (storyId: string) => {
    const storyToEdit = stories.find((story) => story.id === storyId);
    if (storyToEdit) {
      setNewStory({
        name: storyToEdit.name,
        description: storyToEdit.description,
        priority: storyToEdit.priority,
        state: storyToEdit.state,
        owner: storyToEdit.owner,
      });
      setEditMode(true);
      setSelectedStoryId(storyId);
    }
  };

  const saveStory = () => {
    if (!newStory.name.trim() || !newStory.description.trim()) return;

    if (selectedStoryId) {
      const updatedStory = StoriesAPI.update(
        selectedStoryId,
        newStory.name,
        newStory.description,
        newStory.priority as "low" | "medium" | "high",
        id as string,
        newStory.state as "todo" | "doing" | "done"
      );

      if (updatedStory) {
        setStories((prevStories) =>
          prevStories.map((story) =>
            story.id === selectedStoryId ? updatedStory : story
          )
        );
        cancelEdit();
      }
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setSelectedStoryId(null);
    setNewStory({
      name: "",
      description: "",
      priority: "medium",
      state: "todo",
      owner: newStory.owner,
    });
  };

  const handleStoryClick = (storyId: string) => {
    router.push(`/projects/${id}/stories/${storyId}`); // Navigate to the story details page
  };

  if (loading) {
    return <p className="text-center text-gray-700">Loading...</p>;
  }

  if (!project) {
    return <p className="text-center text-gray-700">Project not found</p>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-900 mb-4">
        {project.name}
      </h1>
      <p className="text-lg text-gray-700">{project.description}</p>

      {/* Add Story Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-medium text-gray-900 mb-4">
          {editMode ? "Edit Story" : "Add New Story"}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Story Name"
            value={newStory.name}
            onChange={(e) => setNewStory({ ...newStory, name: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
          <input
            type="text"
            placeholder="Story Description"
            value={newStory.description}
            onChange={(e) =>
              setNewStory({ ...newStory, description: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />

          {/* Priority Selection */}
          <select
            value={newStory.priority}
            onChange={(e) =>
              setNewStory({ ...newStory, priority: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {/* State Selection */}
          <select
            value={newStory.state}
            onChange={(e) =>
              setNewStory({ ...newStory, state: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          >
            <option value="todo">Todo</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>

          <button
            className="w-full bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition duration-300"
            onClick={editMode ? saveStory : addStory}
          >
            {editMode ? "Save Changes" : "Add Story"}
          </button>

          {editMode && (
            <button
              className="w-full mt-2 bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition duration-300"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Stories List */}
      <h2 className="text-2xl font-medium text-gray-900 mt-6 mb-4">
        Project Stories
      </h2>
      {stories.length > 0 ? (
        <ul className="space-y-4">
          {stories.map((story) => (
            <li
              key={story.id}
              className="bg-white p-4 rounded-lg shadow-md"
              onClick={() => handleStoryClick(story.id)} // On click, navigate to story page
            >
              <strong className="text-lg font-semibold text-gray-800">
                {story.name}
              </strong>
              <p className="text-gray-700">{story.description}</p>
              <p className="text-sm text-gray-500">
                Priority: {story.priority.toUpperCase()}
              </p>
              <p className="text-sm text-gray-500 ml-4">State: {story.state}</p>
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => editStory(story.id)} // Edit button
              >
                Edit
              </button>
              <button
                className="text-red-500 hover:text-red-700 ml-4"
                onClick={() => deleteStory(story.id)} // Delete button
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No stories available for this project.</p>
      )}

      <a
        href="/projects"
        className="mt-6 inline-block text-indigo-600 hover:underline"
      >
        Back to Projects
      </a>
    </div>
  );
}
