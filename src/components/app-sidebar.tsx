import {  ChevronUp, Home, Library, ListVideo, Search, Settings, User2, Star } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import SignOut from "./dialogs/SignOut"
// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Playlists",
    url: "/playlists",
    icon: Library,
  },
  {
    title: "Videos",
    url: "/videos",
    icon: ListVideo,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title:"Starred",
    url: "/starred",
    icon: Star
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false)
    const { user } = useAuth()
    const pathname = usePathname()
  return (
    <Sidebar >
      {signOutDialogOpen && <SignOut open={signOutDialogOpen} setOpen={setSignOutDialogOpen} />}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="w-full h-full">
                    <div className="h-full flex flex-col ">
                      <div className="flex items-center gap-2">
                        <User2 /> {user?.name}
                      </div>
                    <p className="pl-8 text-xs text-muted-foreground"><span className={`${user?.creditsUsed! > 3 ? "text-red-500" : user?.creditsUsed! > 1 ? "text-yellow-500" : "text-green-500"}`}>{user?.creditsUsed}</span> Credits used out of 5</p>
                    </div>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => setSignOutDialogOpen(true)}>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

    </Sidebar>
  )
}
