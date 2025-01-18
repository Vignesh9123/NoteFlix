'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/config/config'
import { useRouter } from 'nextjs-toploader/app';
import { Button } from '../ui/button'
import toast from 'react-hot-toast'
function SignOut({open, setOpen}: {open: boolean, setOpen: (open: boolean) => void}) {
    const {user, setUser} = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const signOutClick = ()=>{
        if(user){
            setLoading(true);
            api.get('/user/auth/logout').then(() => {
                setUser(null);
                toast.success("Signed out successfully");
                localStorage.clear();
                router.push('/login');
            }).catch((err) => toast.error(err.response.data.message || "Something went wrong, please try again later."))
            .finally(() =>  {
                setLoading(false);setOpen(false)}
            );
        }
        else{
            router.push('/login');
        }
    }
    return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Sign Out
                </DialogTitle>
                <DialogDescription>
                    Are you sure you want to sign out?
                </DialogDescription>
            </DialogHeader>
            <Button disabled={loading} onClick={signOutClick}>Sign Out</Button>
            <Button disabled={loading} onClick={() => setOpen(false)}>Cancel</Button>
        </DialogContent>
    </Dialog>
  )
}

export default SignOut
