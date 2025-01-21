import React from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '../ui/dialog'
import Editor from '../TipTap';
import { IUserNote } from '@/types';
import { secondsToTime } from '@/lib/utils';
import { Button } from '../ui/button';
import { useRouter } from 'nextjs-toploader/app';
function ViewNoteDialog({
    open,
    setOpen,
    note
}:{
    open: boolean,
    setOpen: (open: boolean) => void,
    note: IUserNote
}) {
const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {note.title}
                </DialogTitle>
            </DialogHeader>
            <Editor className='max-h-[60vh]' text={note.text} isEditable={false} />
            <p className='text-sm text-gray-400'>{secondsToTime(note.timestamp)}</p>
        <DialogFooter>
            <Button onClick={()=>{
                router.push(`/note/${note._id}`);
            }}>Edit</Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default ViewNoteDialog
