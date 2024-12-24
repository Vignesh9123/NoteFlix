import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '../ui/textarea';
import { api } from '@/config/config';
import { Button } from '../ui/button';
function AddNoteDialog({open, setOpen, category, setCategory, libraryId}: {open: boolean, setOpen: (open: boolean) => void, category: string, setCategory: (category: string) => void, libraryId: string}) {
    const [note, setNote] = useState("");
    const handleAddNote = async () => {
        api.post("/video/notes", {notes: {libraryId, text: note, category}})
        .then((res) => {
           console.log(res);
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            setOpen(false);
        })
    }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add {category}</DialogTitle>
            </DialogHeader>
            <DialogDescription>
                Add a note to this video
            </DialogDescription>
            <Textarea placeholder='Add a note' value={note} onChange={(e) => setNote(e.target.value)} />
            <Button onClick={handleAddNote}>Add</Button>
        </DialogContent>
    </Dialog>
  )
}

export default AddNoteDialog
