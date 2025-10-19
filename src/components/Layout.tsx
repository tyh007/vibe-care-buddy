import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

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
    <div className="min-h-screen bg-gradient-hero">
      <div className="page-transition">
        {children}
      </div>
    </div>
  );
};
