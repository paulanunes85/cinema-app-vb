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
  LayoutDashboard,
  MessageSquare,
  FileText,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { departments, production, users } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

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

type SidebarProps = {
  currentView: string;
  onNavigate: (view: string) => void;
};

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentUser = useAppStore((s) => s.currentUser);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "feed", label: "Community", icon: MessageSquare },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  const handleNav = (view: string) => {
    onNavigate(view);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Clapperboard className="h-5 w-5 text-amber-500" />
          <span className="font-semibold text-[15px] tracking-tight text-zinc-900">
            CineBoard
          </span>
        </div>
        <p className="text-[11px] text-zinc-400 leading-tight mt-1">
          {production.title}
        </p>
        <Badge
          variant="secondary"
          className="mt-2 text-[10px] uppercase tracking-wider font-medium"
        >
          {production.stage}
        </Badge>
      </div>

      <Separator />

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium px-2 mb-2">
          General
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={cn(
                "flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-[13px] transition-colors text-left",
                currentView === item.id
                  ? "bg-zinc-100 text-zinc-900 font-medium"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}

        <Separator className="my-3" />

        <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium px-2 mb-2">
          Departments
        </p>
        {departments.map((dept) => {
          const Icon = iconMap[dept.icon] || Film;
          return (
            <button
              key={dept.id}
              onClick={() => handleNav(`dept-${dept.id}`)}
              className={cn(
                "flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-[13px] transition-colors text-left",
                currentView === `dept-${dept.id}`
                  ? "bg-zinc-100 text-zinc-900 font-medium"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
              )}
            >
              <Icon className="h-4 w-4" style={{ color: dept.color }} />
              {dept.name}
            </button>
          );
        })}
      </nav>

      <Separator />

      {/* User */}
      <div className="p-4 flex items-center gap-2.5">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-[11px] bg-zinc-900 text-white">
            {currentUser.avatar}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-zinc-800 truncate">
            {currentUser.name}
          </p>
          <p className="text-[11px] text-zinc-400 capitalize">
            {users
              .find((u) => u.id === currentUser.id)
              ?.roles[0]
              ?.replace("-", " ")}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static z-40 top-0 left-0 h-full w-60 bg-white border-r border-zinc-100 flex-shrink-0 transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
