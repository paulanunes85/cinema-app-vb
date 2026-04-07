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
  Clock,
  AlertCircle,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { departments, users, production } from "@/lib/data";
import { useAppStore } from "@/lib/store";

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

type DashboardProps = {
  onNavigate: (view: string) => void;
};

export function Dashboard({ onNavigate }: DashboardProps) {
  const tasks = useAppStore((s) => s.tasks);
  const feed = useAppStore((s) => s.feed);

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const overallProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
          {production.title}
        </h1>
        <p className="text-sm text-zinc-500 mt-1 max-w-2xl leading-relaxed">
          {production.description}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <Card className="border-zinc-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">
                Done
              </span>
            </div>
            <p className="text-2xl font-semibold text-zinc-900">{doneTasks}</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">
                In Progress
              </span>
            </div>
            <p className="text-2xl font-semibold text-zinc-900">
              {inProgressTasks}
            </p>
          </CardContent>
        </Card>
        <Card className="border-zinc-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-4 w-4 text-zinc-400" />
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">
                Pending
              </span>
            </div>
            <p className="text-2xl font-semibold text-zinc-900">{pendingTasks}</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">
                Overall Progress
              </span>
            </div>
            <p className="text-2xl font-semibold text-zinc-900 mb-2">
              {overallProgress}%
            </p>
            <Progress value={overallProgress} className="h-1.5" />
          </CardContent>
        </Card>
      </div>

      {/* Department Cards */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-zinc-900 mb-4">
          Departments
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {departments.map((dept) => {
            const Icon = iconMap[dept.icon] || Film;
            const deptTasks = tasks.filter((t) => t.departmentId === dept.id);
            const deptDone = deptTasks.filter((t) => t.status === "done").length;
            const deptProgress =
              deptTasks.length > 0
                ? Math.round((deptDone / deptTasks.length) * 100)
                : 0;

            return (
              <Card
                key={dept.id}
                className="border-zinc-100 cursor-pointer hover:border-zinc-200 transition-colors group"
                onClick={() => onNavigate(`dept-${dept.id}`)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-7 w-7 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: `${dept.color}15` }}
                      >
                        <Icon
                          className="h-3.5 w-3.5"
                          style={{ color: dept.color }}
                        />
                      </div>
                      <CardTitle className="text-[13px] font-medium">
                        {dept.name}
                      </CardTitle>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2">
                    <span>
                      {deptDone}/{deptTasks.length} tasks
                    </span>
                    <span>{deptProgress}%</span>
                  </div>
                  <Progress value={deptProgress} className="h-1" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-sm font-medium text-zinc-900 mb-4">
          Recent Activity
        </h2>
        <Card className="border-zinc-100">
          <CardContent className="p-0">
            {feed.slice(0, 5).map((item, i) => {
              const author = users.find((u) => u.id === item.authorId);
              return (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 p-4 ${i < 4 ? "border-b border-zinc-50" : ""}`}
                >
                  <Avatar className="h-7 w-7 mt-0.5 flex-shrink-0">
                    <AvatarFallback className="text-[10px] bg-zinc-100 text-zinc-600">
                      {author?.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-[13px] text-zinc-700">
                      <span className="font-medium text-zinc-900">
                        {author?.name}
                      </span>{" "}
                      {item.content}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {formatRelativeTime(item.createdAt)}
                      {item.departmentId && (
                        <>
                          {" "}
                          ·{" "}
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 font-normal"
                          >
                            {departments.find((d) => d.id === item.departmentId)
                              ?.name}
                          </Badge>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
