import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { api } from '@/config/config';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { timeToSeconds } from '@/lib/utils';
import Editor from '../TipTap';
import { Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
function AddNoteDialog({ open, setOpen, libraryId, fetchNotes, youtubeId, text, noteTitle }: { open: boolean, setOpen: (open: boolean) => void, libraryId: string, fetchNotes: () => void, youtubeId: string, text?: string, noteTitle?: string }) {
    const [note, setNote] = useState<string | null>(null);
    const [timestamp, setTimestamp] = useState<string | null>(null);
    const [title, setTitle] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [AILoading, setAILoading] = useState(false);
    const handleAddNote = async () => {
        setLoading(true);
        const timestampInSeconds = timestamp ? timeToSeconds(timestamp) : 0;
        console.log(timestampInSeconds);
        console.log(note);
        if(!note || !libraryId || !title){
            console.log("Missing fields",{note, libraryId, title});
            return setLoading(false);
        } 
        api.post("/video/notes", {
            notes: {
                libraryId,
                text: note,
                title,
                timestamp: timestampInSeconds != 0 ? timestampInSeconds : null
            }
        })
            .then((res) => {
                console.log(res);
                fetchNotes();
            })
            .catch((err) => {
                if(err instanceof AxiosError){
                    toast.error(err.response?.data.message || "Something went wrong, please try again later.");
                }
                else{
                    toast.error("Something went wrong, please try again later.");
                }
            })
            .finally(() => {
                setLoading(false);
                setNote(null);
                setTimestamp(null);
                setTitle(null);
                setOpen(false);

            })
    }

    useEffect(() => {
       return () => {
        setNote(null);
        setTimestamp(null);
        setTitle(null);
       } 
    },[])
    useEffect(() => {
        if(!open){
            setNote(null);
            setTimestamp(null);
            setTitle(null);
        }
    },[open])

    
    useEffect(() => {
        if(text){
            setNote(text);
        }
        if(noteTitle){
            setTitle(noteTitle);
        }
    }, [text])
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className='md:w-auto'>
                <DialogHeader className='w-full'>
                    <DialogTitle>Add a note</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Add a note to this video
                </DialogDescription>
                <Label htmlFor='timestamp'>Timestamp</Label>
                <div className=''>

                <Input type='text' id='timestamp' placeholder='12:13' value={timestamp || ""} onChange={(e) => setTimestamp(e.target.value)} />
                </div>
                <Label htmlFor='title'>Title</Label>
                <div className=''>
                    <Input type='text' id='title' placeholder='Title' value={title || ""} onChange={(e) => setTitle(e.target.value)} />
                </div>
                {/* <Textarea placeholder='Add a note' value={note} onChange={(e) => setNote(e.target.value)} /> */}
                <Label htmlFor="note">Note</Label>
                <div className='w-full'>
                <Editor text={note!} setText={setNote} isEditable/>
                </div>
                <Button onClick={handleAddNote} disabled={loading || AILoading}>{loading?<div className='flex justify-center items-center'><Loader2 className='animate-spin' /></div> :"Add"}</Button>
            </DialogContent>
        </Dialog>
    )
}

export default AddNoteDialog
