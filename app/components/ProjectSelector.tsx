"use client";

import { useState, useEffect } from "react";
import { ProjectMenager } from "@/services/ProjectMenager";
import { Project } from "@/types/project";
import ProjectAPI from "@/services/ProjectAPI";

export default function ProjectSelector() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const stoedProjects = ProjectAPI.getAll();
    setProjects(stoedProjects);
  }, []);

  const handleSelectProject = (project: Project) => {
    ProjectMenager.setActiveProject(project);
  };

  return (
    <div>
      {projects.map((project) => (
        <button onClick={() => handleSelectProject(project)}>Select</button>
      ))}
    </div>
  );
}
