"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { useState, useEffect } from "react"
import MobileNavbar from "@/components/MobileNavbar"

export default function Layout({ children }: { children: React.ReactNode }) {
    const isMobile = useIsMobile()
    const [isOpen, setIsOpen] = useState(!isMobile)
    const handleToggle = () => {
        if(isMobile) {
            setIsOpen(!isOpen)
        }
        else {
            setIsOpen(true)
        }
    }
    useEffect(() => {
        const handleResize = () => {
            if(!isMobile) {
                setIsOpen(true)
            }
        }
        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [isMobile])
  return (
    <SidebarProvider defaultOpen={isOpen} onOpenChange={handleToggle}>
      <AppSidebar />
      <main className="w-full">
        <MobileNavbar />
        <div className="mt-14 md:mt-0">

        {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
