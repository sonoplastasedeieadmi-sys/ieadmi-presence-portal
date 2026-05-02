import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ScanLine,
  Users,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
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
import logo from "@/assets/logo-ieadmi.png";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Check-in", url: "/checkin", icon: ScanLine },
  { title: "Pessoas", url: "/pessoas", icon: Users },
  { title: "Reuniões", url: "/reunioes", icon: CalendarDays },
  { title: "Privacidade", url: "/privacidade", icon: ShieldCheck },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const isActive = (url: string) =>
    pathname === url || (url !== "/dashboard" && pathname.startsWith(url));

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
          <div className="h-10 w-10 rounded-lg bg-white/10 p-1 flex items-center justify-center">
            <img src={logo} alt="Portal IEADMI" className="h-8 w-8 object-contain" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <p className="text-sm font-semibold">Portal IEADMI</p>
              <p className="text-[11px] text-sidebar-foreground/70">Check-in</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground hover:bg-sidebar-accent/60"
                  >
                    <NavLink to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <div className="mt-auto p-4 text-[11px] text-sidebar-foreground/60">
            Presença · Acesso · Missão
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
