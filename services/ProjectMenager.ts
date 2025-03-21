import { Project } from "@/types/project";

export class ProjectMenager {
  private static STORAGE_KEY = "activeProject";

  static getActiveProject() {
    const project = localStorage.getItem(this.STORAGE_KEY);
    return project ? JSON.parse(project) : null;
  }

  static setActiveProject(project: Project) {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(project));
    }
  }
}
