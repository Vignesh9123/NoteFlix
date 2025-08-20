'use client'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import {Placeholder} from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { Bold, CheckSquare, Code, Italic, List, ListOrdered, Redo, RemoveFormatting, TextQuote, Undo } from 'lucide-react'
const MenuBar = () => {
  const { editor } = useCurrentEditor()

  if (!editor) {
    return null
  }


  return (
    <div className="m-1">
      <div className="button-group border rounded-lg flex flex-wrap gap-3 lg:gap-4 xl:gap-6 justify-center p-1">
        <button
        tabIndex={-1}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          title='Bold'
          className={`p-1 ${editor.isActive('bold') ? 'bg-muted' : ''}`}
        >
          <Bold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          tabIndex={-1}
          title='Italic'
          className={`p-1 ${editor.isActive('italic') ? 'bg-muted' : ''}`}
        >
          <Italic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleCode()
              .run()
          }
          tabIndex={-1}
          title='Code'
          className={`p-1 ${editor.isActive('code') ? 'bg-muted' : ''}`}
        >
          <Code />
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()} title='Remove formatting'
          tabIndex={-1}>
          <RemoveFormatting />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1 ${editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}`}
          title='Heading 1'
          tabIndex={-1}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1 ${editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}`}
          title='Heading 2'
          tabIndex={-1}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1 ${editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}`}
          title='Heading 3'
          tabIndex={-1}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 ${editor.isActive('bulletList') ? 'bg-muted' : ''}`}
          title='Bullet List'
          tabIndex={-1}
        >
          <List />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 ${editor.isActive('orderedList') ? 'bg-muted' : ''}`}
          title='Ordered List'
          tabIndex={-1}
        >
          <ListOrdered />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1 ${editor.isActive('codeBlock') ? 'bg-muted' : ''}`}
          title='Code Block'
          tabIndex={-1}
        >
          Code Block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1 ${editor.isActive('blockquote') ? 'bg-muted' : ''}`}
          title='Blockquote'
          tabIndex={-1}
        >
          <TextQuote />
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .undo()
              .run()
          }
          tabIndex={-1}
          className='disabled:opacity-50'
          title='Undo'
        >
          <Undo />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .redo()
              .run()
          }
          tabIndex={-1}
          className='disabled:opacity-50'
          title='Redo'
        >
          <Redo />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-1 ${editor.isActive('taskList') ? 'bg-muted' : ''}`}
          title='Task List'
          tabIndex={-1}
        >
          <CheckSquare />
        </button>
      </div>
    </div>
  )
}

const extensions = [
  TextStyle.configure({}),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    heading: {
      levels: [1, 2, 3]
    },

  }),
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Placeholder.configure({
    placeholder:"Enter some text..."
  })
]

export default function TipTap ({text, setText, isEditable, className}:{text: string, setText?: (text: string) => void, isEditable?: boolean, className?: string}) {
  const [editorText, setEditorText] = useState(text)
  // eslint-disable-next-line
  const handleChange = (text: any) => {setText?.(String(text.editor.getHTML()))}
  useEffect(() => {setEditorText(text)}, [text])
  const handleUpdate = useDebouncedCallback(handleChange, 500)
  return (
    <EditorProvider slotBefore={isEditable?<MenuBar />:null} shouldRerenderOnTransaction  editable={(isEditable != null)?isEditable:true} editorContainerProps={{className:`${isEditable?'m-1 p-1 editableEditor':''} ${className || ''}`}} onUpdate={handleUpdate} extensions={extensions} content={editorText}></EditorProvider>
  )
}