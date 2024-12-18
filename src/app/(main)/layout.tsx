"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { useState, useEffect } from "react"

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
    }, [])
  return (
    <SidebarProvider defaultOpen={isOpen} onOpenChange={handleToggle}>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger className={isMobile ? "block" : "hidden"}/>
        {children}
      </main>
    </SidebarProvider>
  )
}
