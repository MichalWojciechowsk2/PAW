"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProjectAPI from "../../services/ProjectAPI";
import { Project } from "../../types/project";
import UserProfile from "../components/UserProfile";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    setProjects(ProjectAPI.getAll());
  }, []);

  const addProject = () => {
    if (!newProject.name.trim() || !newProject.description.trim()) return;
    const project = ProjectAPI.create(newProject.name, newProject.description);
    setProjects([...projects, project]);
    setNewProject({ name: "", description: "" });
  };

  const updateProject = () => {
    if (!editingProject) return;
    const updated = ProjectAPI.update(
      editingProject.id,
      editingProject.name,
      editingProject.description
    );
    if (updated) {
      setProjects(projects.map((p) => (p.id === updated.id ? updated : p)));
      setEditingProject(null);
    }
  };

  const deleteProject = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    ProjectAPI.delete(id);
    setProjects(projects.filter((p) => p.id !== id));
  };

  const editProject = (project: Project, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingProject(project);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="text-gray-900 text-right">
        <UserProfile />
      </div>
      <h1 className="text-3xl font-semibold text-center text-gray-900 mb-8">
        Projects
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-medium text-gray-900 mb-4">
          Add New Project
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) =>
              setNewProject({ ...newProject, name: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-700 text-gray-900"
          />
          <input
            type="text"
            placeholder="Project Description"
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-700 text-gray-900"
          />
          <button
            className="w-full bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition duration-300"
            onClick={addProject}
          >
            Add Project
          </button>
        </div>
      </div>
      <ul className="space-y-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block"
          >
            <li className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-200 transition duration-300">
              <div className="flex flex-col">
                <strong className="text-xl font-semibold text-gray-800">
                  {project.name}
                </strong>
                <p className="text-gray-800">{project.description}</p>
                <div className="mt-4 flex space-x-4">
                  <button
                    className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition duration-300"
                    onClick={(e) => editProject(project, e)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300"
                    onClick={(e) => deleteProject(project.id, e)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
