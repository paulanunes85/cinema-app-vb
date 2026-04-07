import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { DepartmentView } from "@/components/DepartmentView";
import { CommunityFeed } from "@/components/CommunityFeed";
import { DocumentsView } from "@/components/DocumentsView";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");

  const renderView = () => {
    if (currentView === "dashboard") {
      return <Dashboard onNavigate={setCurrentView} />;
    }
    if (currentView === "feed") {
      return <CommunityFeed />;
    }
    if (currentView === "documents") {
      return <DocumentsView />;
    }
    if (currentView.startsWith("dept-")) {
      const deptId = currentView.replace("dept-", "");
      return <DepartmentView departmentId={deptId} />;
    }
    return <Dashboard onNavigate={setCurrentView} />;
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-white">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />
        <main className="flex-1 overflow-y-auto bg-zinc-50/50">
          {renderView()}
        </main>
      </div>
    </TooltipProvider>
  );
}

export default App;
