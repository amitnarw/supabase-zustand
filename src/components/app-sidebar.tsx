import {
  LifeBuoy,
  Home,
  EqualApproximately,
  LogOut,
  AlignLeft,
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
} from "@/components/ui/sidebar";
import useStore from "@/utils/zustand_store";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    showTo: "all",
  },
  {
    title: "Contact",
    url: "/contact",
    icon: LifeBuoy,
    showTo: "all",
  },
  {
    title: "About",
    url: "/about",
    icon: EqualApproximately,
    showTo: "all",
  },

  {
    title: "Orders",
    url: "/orders",
    icon: AlignLeft,
    showTo: "loggedIn",
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOut,
    showTo: "loggedIn",
  },
];

export function AppSidebar() {
  const { user } = useStore();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="mt-20">
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(
                (item) =>
                  ((user && item?.showTo === "loggedIn") ||
                    item?.showTo === "all") && (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
