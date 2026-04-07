export type Role =
  | "director"
  | "assistant-director"
  | "photography"
  | "art"
  | "cinematography"
  | "sound"
  | "production"
  | "costume"
  | "makeup"
  | "editing";

export type Department = {
  id: string;
  name: string;
  icon: string;
  color: string;
  roles: Role[];
};

export type TaskStatus = "pending" | "in-progress" | "done";

export type Task = {
  id: string;
  title: string;
  description: string;
  departmentId: string;
  assignedTo: string;
  status: TaskStatus;
  dueDate: string;
  scene?: string;
  comments: Comment[];
  createdAt: string;
};

export type Comment = {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
};

export type Document = {
  id: string;
  title: string;
  type: "link" | "moodboard" | "spreadsheet" | "document" | "image";
  url: string;
  departmentId: string;
  uploadedBy: string;
  createdAt: string;
};

export type FeedItem = {
  id: string;
  authorId: string;
  type: "task-completed" | "comment" | "document-added" | "announcement";
  content: string;
  departmentId?: string;
  taskId?: string;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  avatar: string;
  roles: Role[];
  departmentIds: string[];
};

export type Production = {
  id: string;
  title: string;
  description: string;
  stage: "pre-production" | "production" | "post-production";
  startDate: string;
  endDate: string;
};
