"use client"
import {useState} from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from 'nextjs-toploader/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { api } from "@/config/config"
import {FaGoogle} from 'react-icons/fa'
import { AxiosError } from "axios"
import toast from "react-hot-toast"
export default function LoginForm() {
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
      idToken: await result.user.getIdToken()
    }
    const signinPromise = api.post('/user/auth/googleauth', userData ).then((res) => {
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token)
      router.push('/dashboard');
    })
    toast.promise(signinPromise, {
      loading: 'Signing in...',
      success: 'Logged in successfully',
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

return (
  <>
  <Button variant="outline" className="w-full my-5 flex" onClick={handleGoogleSignIn} disabled={loading || loggedIn}>
      <FaGoogle />
        Login with Google
      </Button>
      <div className="text-center text-sm">
      Don&apos;t have an account?{" "}
      <Link href="/register" className="underline underline-offset-4">
        Sign up
      </Link>
    </div>
  </>

)
}
