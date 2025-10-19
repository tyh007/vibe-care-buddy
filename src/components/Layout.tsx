import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  // Pages that don't need the standard layout (like auth, onboarding, landing)
  const noLayoutPages = ["/", "/auth", "/onboarding"];
  const shouldShowLayout = !noLayoutPages.includes(location.pathname);

  if (!shouldShowLayout) {
    return <div className="page-transition">{children}</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-hero">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b border-border/50 bg-card/30 backdrop-blur-sm px-4">
            <SidebarTrigger />
          </header>
          <main className="flex-1 overflow-auto page-transition">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
