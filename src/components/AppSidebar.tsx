import { Heart, LayoutDashboard, MessageSquare, Brain, Users, Tag, TrendingUp, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Vibe Partner", url: "/vibe-partner", icon: Heart },
  { title: "CBT Therapist", url: "/cbt-therapist", icon: Brain },
  { title: "Common Room", url: "/common-room", icon: Users },
  { title: "Mood Tracker", url: "/mood-tracker", icon: MessageSquare },
  { title: "Analytics", url: "/mood-dashboard", icon: TrendingUp },
  { title: "Shop", url: "/shop", icon: Tag },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const { toast } = useToast();
  const collapsed = state === "collapsed";

  const handleLogout = () => {
    navigate('/auth');
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
      <div className="flex items-center gap-2 p-4 border-b border-border">
        {!collapsed && (
          <>
            <Heart className="w-6 h-6 text-primary animate-pulse" />
            <span className="font-semibold text-lg">VibeCare</span>
          </>
        )}
        {collapsed && <Heart className="w-6 h-6 text-primary animate-pulse mx-auto" />}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted/50"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <div className="mt-auto p-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
