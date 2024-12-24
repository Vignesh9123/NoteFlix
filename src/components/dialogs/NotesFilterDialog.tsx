import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'
function NotesFilterDialog({open, setOpen,keyPointFilter, setKeyPointFilter, todoFilter, setTodoFilter, questionFilter, setQuestionFilter}: {open: boolean, setOpen: (open: boolean) => void, keyPointFilter: boolean, setKeyPointFilter: (keyPointFilter: boolean) => void, todoFilter: boolean, setTodoFilter: (todoFilter: boolean) => void, questionFilter: boolean, setQuestionFilter: (questionFilter: boolean) => void}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Notes</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Select the categories you want to filter by
        </DialogDescription>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <Checkbox id='key-point' checked={keyPointFilter} onCheckedChange={setKeyPointFilter} />
              <Label htmlFor='key-point'>Key Points</Label>
            </div>
            <div className='flex items-center gap-2'>
              <Checkbox id='todo' checked={todoFilter} onCheckedChange={setTodoFilter} />
              <Label htmlFor='todo'>To Do</Label>
            </div>
            <div className='flex items-center gap-2'>
              <Checkbox id='question' checked={questionFilter} onCheckedChange={setQuestionFilter} />
              <Label htmlFor='question'>Questions</Label>
            </div>
          </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NotesFilterDialog
