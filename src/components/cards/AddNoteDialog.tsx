import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '../ui/textarea';
import { api } from '@/config/config';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { timeToSeconds } from '@/lib/utils';
import Editor from '../Editor';
function AddNoteDialog({ open, setOpen, category, setCategory, libraryId, fetchNotes }: { open: boolean, setOpen: (open: boolean) => void, category: string, setCategory: (category: string) => void, libraryId: string, fetchNotes: () => void }) {
    const [note, setNote] = useState("");
    const [timestamp, setTimestamp] = useState<string | null>(null);
    const handleAddNote = async () => {
        const timestampInSeconds = timestamp ? timeToSeconds(timestamp) : 0;
        console.log(timestampInSeconds);
        console.log(note);
        // return;
        api.post("/video/notes", {
            notes: {
                libraryId,
                text: note,
                category, 
                timestamp: timestampInSeconds != 0 ? timestampInSeconds : null
            }
        })
            .then((res) => {
                console.log(res);
                fetchNotes();
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
                <Label htmlFor='timestamp'>Timestamp</Label>
                <div className=''>

                <Input type='text' id='timestamp' placeholder='12:13' value={timestamp || ""} onChange={(e) => setTimestamp(e.target.value)} />
                </div>
                {/* <Textarea placeholder='Add a note' value={note} onChange={(e) => setNote(e.target.value)} /> */}
                <Label htmlFor="note">Note</Label>
                <div className=''>
                <Editor text={note} setText={setNote}/>
                </div>
                <Button onClick={handleAddNote}>Add</Button>
            </DialogContent>
        </Dialog>
    )
}

export default AddNoteDialog
