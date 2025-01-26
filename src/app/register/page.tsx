import { GalleryVerticalEnd } from "lucide-react"

import RegisterForm from "@/components/register-form"
import Link from "next/link"
import Spline from "@splinetool/react-spline"

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <Link href="/" className="hidden lg:flex absolute top-7 left-8 z-30 items-center gap-2 font-medium">
      VidScribe
      </Link>
      <Link href="/" className="flex lg:hidden justify-center mt-5 gap-2 font-medium">
      VidScribe
      </Link>
      <div className="relative hidden  lg:block">
        
      <Spline
        scene="https://prod.spline.design/9Pwi-5ymuuJu6L2X/scene.splinecode" 
      />
      </div>
      <div className="flex flex-col gap-4 p-6 lg:p-10">
        <div className="flex flex-1 lg:items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
      
    </div>
  )
}
