'use client'
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/config/config'
import { useRouter } from 'nextjs-toploader/app';
import { Button } from '../ui/button'
function SignOut({open, setOpen}: {open: boolean, setOpen: (open: boolean) => void}) {
    const {user, setUser} = useAuth();
    const router = useRouter();
    const signOutClick = ()=>{
        if(user){
            api.get('/user/auth/logout').then(() => {
                setUser(null);
                router.push('/login');
            }).catch((err) => console.log(err))
            .finally(() => setOpen(false));
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
            <Button onClick={signOutClick}>Sign Out</Button>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogContent>
    </Dialog>
  )
}

export default SignOut
