import LoginForm from "@/components/login-form"
import Link from "next/link"
import Spline from "@splinetool/react-spline/next"

export default function LoginPage() {
  
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-8">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
           
            NoteFlix
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative max-h-screen hidden bg-muted lg:block">
      <Spline
        scene="https://prod.spline.design/9Pwi-5ymuuJu6L2X/scene.splinecode" 
      />
      </div>
    </div>
  )
}

//https://prod.spline.design/9Pwi-5ymuuJu6L2X/scene.splinecode