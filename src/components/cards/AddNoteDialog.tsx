import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '../ui/textarea';
import { api } from '@/config/config';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { timeToSeconds } from '@/lib/utils';
function AddNoteDialog({ open, setOpen, category, setCategory, libraryId }: { open: boolean, setOpen: (open: boolean) => void, category: string, setCategory: (category: string) => void, libraryId: string }) {
    const [note, setNote] = useState("");
    const [timestamp, setTimestamp] = useState<string | null>(null);
    const handleAddNote = async () => {
        const timestampInSeconds = timestamp ? timeToSeconds(timestamp) : 0;
        console.log(timestampInSeconds);
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
                <Input type='text' id='timestamp' placeholder='12:13' value={timestamp || ""} onChange={(e) => setTimestamp(e.target.value)} />
                <Textarea placeholder='Add a note' value={note} onChange={(e) => setNote(e.target.value)} />
                <Button onClick={handleAddNote}>Add</Button>
            </DialogContent>
        </Dialog>
    )
}

export default AddNoteDialog
