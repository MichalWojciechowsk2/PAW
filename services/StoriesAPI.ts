class StoriesAPI {
  private static STORAGE_KEY = "stories";

  static getAll(): {
    id: string;
    name: string;
    description: string;
    priority: "low" | "medium" | "high";
    projectId: string;
    createDate: Date;
    state: "todo" | "doing" | "done";
    owner: string;
  }[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getById(id: string) {
    return this.getAll().find((project) => project.id === id) || null;
  }

  static create(
    name: string,
    description: string,
    priority: "low" | "medium" | "high",
    projectId: string,
    createDate: Date,
    state: "todo" | "doing" | "done",
    owner: string
  ) {
    const stories = this.getAll();
    const newStory = {
      id: crypto.randomUUID(),
      name,
      description,
      priority,
      projectId,
      createDate,
      state,
      owner,
    };
    stories.push(newStory);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
    return newStory;
  }

  static update(
    id: string,
    name: string,
    description: string,
    priority: "low" | "medium" | "high",
    projectId: string,
    createDate: Date,
    state: "todo" | "doing" | "done",
    owner: string
  ) {
    const stories = this.getAll();
    const index = stories.findIndex((s) => s.id === id);
    if (index === -1) return null;
    stories[index] = {
      id,
      name,
      description,
      priority,
      projectId,
      createDate,
      state,
      owner,
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
    return stories[index];
  }

  static delete(id: string) {
    let stories = this.getAll();
    stories = stories.filter((story) => story.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
  }
}

export default StoriesAPI;
