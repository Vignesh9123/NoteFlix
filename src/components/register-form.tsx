"use client"
import {useState} from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { FaGoogle } from "react-icons/fa"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { api } from "@/config/config"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from 'nextjs-toploader/app';
import { AxiosError } from "axios"
import { toast } from "react-hot-toast"

export default function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [name, setName] = useState("")
  const {setUser} = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
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
      const signupPromise = api.post('/user/auth/googleauth', userData ).then((res) => {
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token)
        router.push('/dashboard');
      })
      toast.promise(signupPromise, {
        loading: 'Signing in...',
        success: 'Logged in successfully',
      })
    }catch(error){
      if(error instanceof AxiosError){
        toast.error(error.response?.data.message || "Something went wrong, please try again later."); 
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
    try {
      setLoading(true)
      const response = await api.post('/user/auth/signup', { name, email, password });
      toast.success("Account created successfully, please log in");
      router.push('/login')
    } catch (error) {
      if(error instanceof AxiosError){
        toast.error(error.response?.data.message || "Something went wrong, please try again later.");
      }
      else{
        toast.error("Something went wrong, please try again later.");
      }
    }finally{
      setLoading(false)
    }
  }
  return (
    <>
    {/* <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to create an account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
           
          </div>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button disabled={loading} type="submit" className="w-full">
          Create Account
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </form>
    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border mt-5">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div> */}
  <Button disabled={loading || loggedIn} variant="outline" className="w-full my-5 flex"  onClick={handleGoogleSignIn}>
      <FaGoogle />
        Sign up with Google
      </Button>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </>
  )
}
