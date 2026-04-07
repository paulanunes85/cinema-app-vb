import {
  CheckCircle2,
  MessageSquare,
  FileUp,
  Megaphone,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { departments, users } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import type { FeedItem } from "@/lib/types";

const feedIcon: Record<FeedItem["type"], typeof CheckCircle2> = {
  "task-completed": CheckCircle2,
  comment: MessageSquare,
  "document-added": FileUp,
  announcement: Megaphone,
};

const feedColor: Record<FeedItem["type"], string> = {
  "task-completed": "text-emerald-500",
  comment: "text-blue-500",
  "document-added": "text-violet-500",
  announcement: "text-amber-500",
};

export function CommunityFeed() {
  const feed = useAppStore((s) => s.feed);
  const sorted = [...feed].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
          Community
        </h1>
        <p className="text-[13px] text-zinc-500 mt-1">
          Everything that's happening across all departments.
        </p>
      </div>

      <div className="space-y-2">
        {sorted.map((item) => {
          const author = users.find((u) => u.id === item.authorId);
          const Icon = feedIcon[item.type];
          const color = feedColor[item.type];

          return (
            <Card key={item.id} className="border-zinc-100">
              <CardContent className="p-4 flex items-start gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0 mt-0.5">
                  <AvatarFallback className="text-[10px] bg-zinc-100 text-zinc-600">
                    {author?.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-3.5 w-3.5 ${color}`} />
                    <p className="text-[13px] text-zinc-700">
                      <span className="font-medium text-zinc-900">
                        {author?.name}
                      </span>{" "}
                      {item.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[11px] text-zinc-400">
                      {formatTime(item.createdAt)}
                    </span>
                    {item.departmentId && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 font-normal"
                      >
                        {departments.find((d) => d.id === item.departmentId)
                          ?.name}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
