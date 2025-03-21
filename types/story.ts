export type Story = {
  id: string;
  name: string;
  description: string;
  priority: "low" | "medium" | "high";
  projectId: string;
  createDate: Date;
  state: "todo" | "doing" | "done";
  owner: string;
};
