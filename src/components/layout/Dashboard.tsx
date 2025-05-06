import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useTheme } from "@/hooks/use-theme";

interface DashboardProps {
  children: React.ReactNode;
}

export function Dashboard({ children }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <div className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col lg:pl-64">
        <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
