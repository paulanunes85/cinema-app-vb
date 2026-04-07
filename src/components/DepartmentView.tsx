import { useState } from "react";
import {
  Camera,
  Palette,
  Film,
  Music,
  Clapperboard,
  Shirt,
  Sparkles,
  Scissors,
  CheckCircle2,
  Circle,
  Clock,
  MessageSquare,
  Plus,
  Send,
  FileText,
  Link,
  Image,
  Table,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { departments, users, documents } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import type { TaskStatus, Task } from "@/lib/types";

const iconMap: Record<string, LucideIcon> = {
  Camera,
  Palette,
  Film,
  Music,
  Clapperboard,
  Shirt,
  Sparkles,
  Scissors,
};

const docIconMap: Record<string, LucideIcon> = {
  link: Link,
  moodboard: LayoutGrid,
  spreadsheet: Table,
  document: FileText,
  image: Image,
};

type DepartmentViewProps = {
  departmentId: string;
};

export function DepartmentView({ departmentId }: DepartmentViewProps) {
  const dept = departments.find((d) => d.id === departmentId);
  const tasks = useAppStore((s) => s.tasks);
  const toggleTaskStatus = useAppStore((s) => s.toggleTaskStatus);
  const addComment = useAppStore((s) => s.addComment);
  const addTask = useAppStore((s) => s.addTask);

  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");

  if (!dept) return null;

  const Icon = iconMap[dept.icon] || Film;
  const deptTasks = tasks.filter((t) => t.departmentId === departmentId);
  const deptDocs = documents.filter((d) => d.departmentId === departmentId);
  const doneTasks = deptTasks.filter((t) => t.status === "done").length;
  const progress =
    deptTasks.length > 0
      ? Math.round((doneTasks / deptTasks.length) * 100)
      : 0;

  const groupedTasks: Record<TaskStatus, Task[]> = {
    "in-progress": deptTasks.filter((t) => t.status === "in-progress"),
    pending: deptTasks.filter((t) => t.status === "pending"),
    done: deptTasks.filter((t) => t.status === "done"),
  };

  const handleAddComment = (taskId: string) => {
    if (!commentText.trim()) return;
    addComment(taskId, commentText.trim());
    setCommentText("");
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;
    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      departmentId,
      assignedTo: useAppStore.getState().currentUser.id,
      status: "pending",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      comments: [],
      createdAt: new Date().toISOString(),
    };
    addTask(task);
    setNewTaskTitle("");
    setNewTaskDesc("");
    setNewTaskOpen(false);
  };

  const statusConfig = {
    "in-progress": {
      label: "In Progress",
      icon: Clock,
      color: "text-amber-500",
    },
    pending: { label: "Pending", icon: Circle, color: "text-zinc-400" },
    done: { label: "Done", icon: CheckCircle2, color: "text-emerald-500" },
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${dept.color}15` }}
          >
            <Icon className="h-5 w-5" style={{ color: dept.color }} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
              {dept.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[12px] text-zinc-400">
                {doneTasks}/{deptTasks.length} tasks completed
              </span>
              <Progress value={progress} className="h-1 w-20" />
              <span className="text-[12px] text-zinc-400">{progress}%</span>
            </div>
          </div>
        </div>

        <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
          <DialogTrigger>
            <Button size="sm" className="gap-1.5 text-[13px]">
              <Plus className="h-3.5 w-3.5" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <Input
                placeholder="Task title..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <Textarea
                placeholder="Description (optional)"
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                rows={3}
              />
              <Button onClick={handleCreateTask} className="w-full">
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="tasks" className="text-[13px]">
            Checklist
          </TabsTrigger>
          <TabsTrigger value="docs" className="text-[13px]">
            Documents
          </TabsTrigger>
          <TabsTrigger value="team" className="text-[13px]">
            Team
          </TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          {(["in-progress", "pending", "done"] as TaskStatus[]).map(
            (status) => {
              const group = groupedTasks[status];
              if (group.length === 0) return null;
              const config = statusConfig[status];
              const StatusIcon = config.icon;

              return (
                <div key={status}>
                  <div className="flex items-center gap-2 mb-3">
                    <StatusIcon className={`h-4 w-4 ${config.color}`} />
                    <h3 className="text-[13px] font-medium text-zinc-700">
                      {config.label}
                    </h3>
                    <Badge variant="secondary" className="text-[10px] px-1.5">
                      {group.length}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {group.map((task) => {
                      const assignee = users.find(
                        (u) => u.id === task.assignedTo
                      );
                      const isExpanded = expandedTask === task.id;

                      return (
                        <Card
                          key={task.id}
                          className="border-zinc-100 overflow-hidden"
                        >
                          <div
                            className="flex items-start gap-3 p-3.5 cursor-pointer"
                            onClick={() =>
                              setExpandedTask(isExpanded ? null : task.id)
                            }
                          >
                            <Checkbox
                              checked={task.status === "done"}
                              onCheckedChange={(e) => {
                                e; // prevent propagation
                                toggleTaskStatus(task.id);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-[13px] ${task.status === "done" ? "line-through text-zinc-400" : "text-zinc-800"}`}
                              >
                                {task.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                {task.scene && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-1.5 py-0 font-normal"
                                  >
                                    {task.scene}
                                  </Badge>
                                )}
                                <span className="text-[11px] text-zinc-400">
                                  Due{" "}
                                  {new Date(task.dueDate).toLocaleDateString(
                                    "en-US",
                                    { month: "short", day: "numeric" }
                                  )}
                                </span>
                                {task.comments.length > 0 && (
                                  <span className="flex items-center gap-0.5 text-[11px] text-zinc-400">
                                    <MessageSquare className="h-3 w-3" />
                                    {task.comments.length}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Avatar className="h-6 w-6 flex-shrink-0">
                              <AvatarFallback className="text-[9px] bg-zinc-100 text-zinc-500">
                                {assignee?.avatar}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          {/* Expanded view */}
                          {isExpanded && (
                            <div className="border-t border-zinc-50 bg-zinc-50/50">
                              <div className="p-4">
                                <p className="text-[13px] text-zinc-600 leading-relaxed">
                                  {task.description}
                                </p>

                                {/* Comments */}
                                {task.comments.length > 0 && (
                                  <div className="mt-4 space-y-3">
                                    <Separator />
                                    <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                                      Comments
                                    </p>
                                    {task.comments.map((comment) => {
                                      const commentAuthor = users.find(
                                        (u) => u.id === comment.authorId
                                      );
                                      return (
                                        <div
                                          key={comment.id}
                                          className="flex gap-2.5"
                                        >
                                          <Avatar className="h-6 w-6 flex-shrink-0 mt-0.5">
                                            <AvatarFallback className="text-[9px] bg-zinc-200 text-zinc-600">
                                              {commentAuthor?.avatar}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <p className="text-[12px]">
                                              <span className="font-medium text-zinc-700">
                                                {commentAuthor?.name}
                                              </span>
                                              <span className="text-zinc-400 ml-2 text-[11px]">
                                                {new Date(
                                                  comment.createdAt
                                                ).toLocaleDateString("en-US", {
                                                  month: "short",
                                                  day: "numeric",
                                                })}
                                              </span>
                                            </p>
                                            <p className="text-[12px] text-zinc-600 mt-0.5 leading-relaxed">
                                              {comment.text}
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {/* Add comment */}
                                <div className="flex gap-2 mt-4">
                                  <Textarea
                                    placeholder="Add a comment..."
                                    value={commentText}
                                    onChange={(e) =>
                                      setCommentText(e.target.value)
                                    }
                                    className="text-[13px] min-h-[60px]"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="flex-shrink-0 self-end"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddComment(task.id);
                                    }}
                                  >
                                    <Send className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            }
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="docs">
          <div className="space-y-2">
            {deptDocs.length === 0 ? (
              <p className="text-[13px] text-zinc-400 py-8 text-center">
                No documents yet for this department.
              </p>
            ) : (
              deptDocs.map((doc) => {
                const DocIcon = docIconMap[doc.type] || FileText;
                const uploader = users.find((u) => u.id === doc.uploadedBy);
                return (
                  <Card key={doc.id} className="border-zinc-100">
                    <CardContent className="p-3.5 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-md bg-zinc-100 flex items-center justify-center flex-shrink-0">
                        <DocIcon className="h-4 w-4 text-zinc-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-zinc-800 truncate">
                          {doc.title}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          {uploader?.name} ·{" "}
                          {new Date(doc.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] capitalize font-normal"
                      >
                        {doc.type}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <div className="space-y-2">
            {users
              .filter((u) => u.departmentIds.includes(departmentId))
              .map((user) => (
                <Card key={user.id} className="border-zinc-100">
                  <CardContent className="p-3.5 flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-[11px] bg-zinc-100 text-zinc-600">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-[13px] font-medium text-zinc-800">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-zinc-400 capitalize">
                        {user.roles[0]?.replace("-", " ")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
