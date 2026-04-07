import { create } from "zustand";
import type { Task, Comment, FeedItem, User, TaskStatus } from "./types";
import {
  tasks as initialTasks,
  feedItems as initialFeed,
  users,
} from "./data";

type AppStore = {
  currentUser: User;
  tasks: Task[];
  feed: FeedItem[];
  toggleTaskStatus: (taskId: string) => void;
  addComment: (taskId: string, text: string) => void;
  addTask: (task: Task) => void;
};

export const useAppStore = create<AppStore>((set, get) => ({
  currentUser: users[0], // Sofía — AD
  tasks: initialTasks,
  feed: initialFeed,

  toggleTaskStatus: (taskId: string) => {
    set((state) => {
      const updatedTasks = state.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const newStatus: TaskStatus = t.status === "done" ? "pending" : "done";
        return { ...t, status: newStatus };
      });

      const task = state.tasks.find((t) => t.id === taskId);
      if (!task) return { tasks: updatedTasks };

      const newFeedItem: FeedItem = {
        id: `feed-${Date.now()}`,
        authorId: get().currentUser.id,
        type: "task-completed",
        content: `marked '${task.title}' as ${task.status === "done" ? "pending" : "done"}`,
        departmentId: task.departmentId,
        taskId: task.id,
        createdAt: new Date().toISOString(),
      };

      return {
        tasks: updatedTasks,
        feed: [newFeedItem, ...state.feed],
      };
    });
  },

  addComment: (taskId: string, text: string) => {
    const user = get().currentUser;
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      authorId: user.id,
      text,
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const updatedTasks = state.tasks.map((t) =>
        t.id === taskId ? { ...t, comments: [...t.comments, comment] } : t
      );

      const task = state.tasks.find((t) => t.id === taskId);
      const newFeedItem: FeedItem = {
        id: `feed-${Date.now()}`,
        authorId: user.id,
        type: "comment",
        content: `commented on '${task?.title}': "${text.slice(0, 80)}${text.length > 80 ? "…" : ""}"`,
        departmentId: task?.departmentId,
        taskId,
        createdAt: new Date().toISOString(),
      };

      return {
        tasks: updatedTasks,
        feed: [newFeedItem, ...state.feed],
      };
    });
  },

  addTask: (task: Task) => {
    set((state) => ({
      tasks: [...state.tasks, task],
      feed: [
        {
          id: `feed-${Date.now()}`,
          authorId: get().currentUser.id,
          type: "announcement",
          content: `created task '${task.title}'`,
          departmentId: task.departmentId,
          taskId: task.id,
          createdAt: new Date().toISOString(),
        },
        ...state.feed,
      ],
    }));
  },
}));
