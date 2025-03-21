class ProjectAPI {
  private static STORAGE_KEY = "projects";

  static getAll(): { id: string; name: string; description: string }[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getById(id: string) {
    return this.getAll().find((project) => project.id === id) || null;
  }

  static create(name: string, description: string) {
    const projects = this.getAll();
    const newProject = { id: crypto.randomUUID(), name, description };
    projects.push(newProject);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    return newProject;
  }

  static update(id: string, name: string, description: string) {
    const projects = this.getAll();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return null;
    projects[index] = { id, name, description };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    return projects[index];
  }

  static delete(id: string) {
    let projects = this.getAll();
    projects = projects.filter((project) => project.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
  }
}

export default ProjectAPI;
