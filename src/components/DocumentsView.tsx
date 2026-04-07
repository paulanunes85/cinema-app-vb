import {
  FileText,
  Link,
  Image,
  Table,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { departments, users, documents } from "@/lib/data";

const docIconMap: Record<string, LucideIcon> = {
  link: Link,
  moodboard: LayoutGrid,
  spreadsheet: Table,
  document: FileText,
  image: Image,
};

export function DocumentsView() {
  const grouped = departments
    .map((dept) => ({
      dept,
      docs: documents.filter((d) => d.departmentId === dept.id),
    }))
    .filter((g) => g.docs.length > 0);

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
          Documents
        </h1>
        <p className="text-[13px] text-zinc-500 mt-1">
          All shared documents, mood boards, links, and files across the
          production.
        </p>
      </div>

      <div className="space-y-6">
        {grouped.map(({ dept, docs }) => (
          <div key={dept.id}>
            <h2 className="text-[13px] font-medium text-zinc-700 mb-2">
              {dept.name}
            </h2>
            <div className="space-y-2">
              {docs.map((doc) => {
                const DocIcon = docIconMap[doc.type] || FileText;
                const uploader = users.find((u) => u.id === doc.uploadedBy);
                return (
                  <Card key={doc.id} className="border-zinc-100">
                    <CardContent className="p-3.5 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-md bg-zinc-100 flex items-center justify-center flex-shrink-0">
                        <DocIcon className="h-4 w-4 text-zinc-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-zinc-800 truncate">
                          {doc.title}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          Uploaded by {uploader?.name} ·{" "}
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
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
