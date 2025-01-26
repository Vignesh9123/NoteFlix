"use client"
import {useState} from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from 'nextjs-toploader/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { api } from "@/config/config"
import {FaGoogle} from 'react-icons/fa'
import { AxiosError } from "axios"
import toast from "react-hot-toast"
export default function LoginForm({
className,
...props
}: React.ComponentPropsWithoutRef<"form">) {
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [loading, setLoading] = useState(false)
const [loggedIn, setLoggedIn] = useState(false)
const {setUser} = useAuth()
const router = useRouter()

const handleGoogleSignIn = async()=>{
  setLoading(true)
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  try{
    const result = await signInWithPopup(auth, provider)
    if(result.user) setLoggedIn(true)
    const userData = {
      name: result.user.displayName,
      email: result.user.email,
      password: result.user.refreshToken,
    }
    api.post('/user/auth/googleauth', userData ).then((res) => {
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token)
      toast.success("Logged in successfully");
      router.push('/dashboard');
    })
  }catch(error){
    if(error instanceof AxiosError){
      toast.error(error.response?.data.error || "Something went wrong, please try again later."); 
    } 
    else{
      toast.error("Something went wrong, please try again later.");
    }
    setLoggedIn(false)
  }
  finally{
    setLoading(false)
  }
}
const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setLoading(true)
  try {
    const response = await api.post('/user/auth/signin', { email, password });
    toast.success("Logged in successfully");
    setUser(response.data.data.user);
    if(response.data.data.token) setLoggedIn(true)
    localStorage.setItem('token', response.data.data.token)
    router.push('/dashboard')    
  } catch (error) {
    if(error instanceof AxiosError){
      toast.error(error.response?.data.error || "Something went wrong, please try again later.");
    }
    else{
      toast.error("Something went wrong, please try again later.");
    }
  }
  finally{
    setLoading(false)
  }
}
return (
  <>
  <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
    <div className="flex flex-col items-center gap-2 text-center">
      <h1 className="text-2xl font-bold">Login to your account</h1>
      <p className="text-balance text-sm text-muted-foreground">
        Enter your email below to login to your account
      </p>
    </div>
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
          <a
            href="#"
            className="ml-auto text-sm underline-offset-4 hover:underline"
          >
            Forgot your password?
          </a>
        </div>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <Button disabled={loading || loggedIn} type="submit" className="w-full">
        Login
      </Button>
      
    </div>
    <div className="text-center text-sm">
      Don&apos;t have an account?{" "}
      <Link href="/register" className="underline underline-offset-4">
        Sign up
      </Link>
    </div>
  </form>
  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border mt-5">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
  <Button variant="outline" className="w-full mt-5 flex" onClick={handleGoogleSignIn} disabled={loading || loggedIn}>
      <FaGoogle />
        Login with Google
      </Button>

  </>

)
}
