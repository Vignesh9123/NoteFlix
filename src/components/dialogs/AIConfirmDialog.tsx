import React from 'react'
import {Dialog, DialogHeader ,DialogContent, DialogDescription, DialogFooter,DialogTitle} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { useAuth } from '@/context/AuthContext'
function AIConfirmDialog({open, setOpen, onConfirm}: {open: boolean, setOpen: (open: boolean) => void, onConfirm: () => void}) {
    const {user} = useAuth()
    return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
        <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
            <DialogDescription>Are you sure you want to proceed?</DialogDescription>
        </DialogHeader>
            You will lose 1 credit if you proceed.You currently have {5 - (user?.creditsUsed ?? 0)} credits left.
            <p className='text-sm text-muted'>*AI-generated summaries may contain inaccuracies—review for best results.</p>
        <DialogFooter>
            <Button onClick={onConfirm}>Confirm</Button>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default AIConfirmDialog
