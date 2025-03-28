export type Task = {
  id: string;
  name: string;
  description: string;
  priority: "low" | "medium" | "high";
  storyId: string;
  estimatedTimeOfCompletion: number;
  state: "todo" | "doing" | "done";
  addedDate: string;
  endDate: string | null;
  responsibleUser: string;
};
