"use client"
import {useState} from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FaGoogle } from "react-icons/fa"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { api } from "@/config/config"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from 'nextjs-toploader/app';
import { AxiosError } from "axios"
import { toast } from "react-hot-toast"

export default function RegisterForm() {
  const {setUser} = useAuth()
  const router = useRouter()
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
          idToken: await result.user.getIdToken()
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

  return (
    <>
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
