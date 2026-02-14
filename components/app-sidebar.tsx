"use client"

import * as React from "react"
import Link from "next/link"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { ThemeSwitcher } from "@/components/theme-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutGridIcon,
  UtensilsCrossedIcon,
  ClipboardListIcon,
  LeafIcon,
  PrinterIcon,
  UsersIcon,
  LandmarkIcon,
  HomeIcon,
  LifeBuoyIcon,
  SendIcon,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { Logo } from "@/components/logo"

const data = {
  home: [
    {
      title: "Home",
      url: "/dashboard",
      icon: HomeIcon,
    },
  ],
  cucina: [
    {
      title: "Categorie",
      url: "/dashboard/categories",
      icon: LayoutGridIcon,
    },
    {
      title: "Cibi",
      url: "/dashboard/foods",
      icon: UtensilsCrossedIcon,
    },
    {
      title: "Ingredienti",
      url: "/dashboard/ingredients",
      icon: LeafIcon,
    },
  ],
  ordini: [
    {
      title: "Ordini",
      url: "/dashboard/orders",
      icon: ClipboardListIcon,
    },
  ],
  gestione: [
    {
      title: "Stampanti",
      url: "/dashboard/printers",
      icon: PrinterIcon,
    },
    {
      title: "Utenti",
      url: "/dashboard/users",
      icon: UsersIcon,
    },
    {
      title: "Casse",
      url: "/dashboard/cash-registers",
      icon: LandmarkIcon,
    },
  ],
  navSecondary: [
    {
      title: "Supporto",
      url: "#",
      icon: LifeBuoyIcon,
    },
    {
      title: "Feedback",
      url: "#",
      icon: SendIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()

  const user = {
    name: session?.user?.name || "Admin",
    email: session?.user?.email || "",
    avatar: "",
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-16 items-center justify-center rounded-lg overflow-hidden">
                  <Logo className="w-full h-full" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">MyAmministratore</span>
                  <span className="truncate text-xs">MySagra</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.home} />
        <NavMain items={data.cucina} label="Cucina" />
        <div className="my-2">
          <NavMain items={data.ordini} />
        </div>
        <NavMain items={data.gestione} label="Gestione" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <ThemeSwitcher />
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
