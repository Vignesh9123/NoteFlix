'use client'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
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
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
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
          className={`p-1 ${editor.isActive('code') ? 'bg-muted' : ''}`}
        >
          <Code />
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()} title='Remove formatting'>
          <RemoveFormatting />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1 ${editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1 ${editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1 ${editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}`}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 ${editor.isActive('bulletList') ? 'bg-muted' : ''}`}
        >
          <List />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 ${editor.isActive('orderedList') ? 'bg-muted' : ''}`}
        >
          <ListOrdered />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1 ${editor.isActive('codeBlock') ? 'bg-muted' : ''}`}
        >
          Code Block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1 ${editor.isActive('blockquote') ? 'bg-muted' : ''}`}
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
          className='disabled:opacity-50'
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
          className='disabled:opacity-50'
        >
          <Redo />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-1 ${editor.isActive('taskList') ? 'bg-muted' : ''}`}
        >
          <CheckSquare />
        </button>
      </div>
    </div>
  )
}

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
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


const content = "<h2>Facing a Hiring Freeze? Learn from My Mistakes!</h2>\n\n<p>The current job market is incredibly competitive.  I landed a 30 LPA job in 2020 (while my batchmates struggled), but only after three interviews. This video shares my mistakes to help you avoid similar pitfalls.</p>\n\n<ul>\n<li><p><strong>Mistake 1: Incorrect DSA Practice.</strong> I focused too much on competitive programming (CP) without a structured approach.  Instead, learn DSA systematically (e.g., using Striver's A to Z), mastering various algorithms before tackling CP. Don't get stuck on repetitive questions; focus on challenging problems to expand your knowledge.</p></li>\n<li><p><strong>Mistake 2: Lack of Projects & Development Experience.</strong> My resume was CP-heavy, hindering internship prospects.  Balance CP with projects (web, app, etc.) and deploy them.  A diverse skillset increases interview opportunities.</p></li>\n<li><p><strong>Mistake 3: Introversion.</strong>  Network! Engage with tech communities (Twitter, LinkedIn).  Publicly share your work and achievements to increase visibility and build connections. A strong network can be a lifeline during layoffs.</p></li>\n</ul>\n\n<p>Don't be one-dimensional.  A balanced skillset is crucial for success.  Consider resources like Great Learning Career Academy for structured learning and guaranteed placement opportunities.</p>\n\n<ul data-type=\"taskList\">\n<li data-checked=\"false\" data-type=\"taskItem\"><label><input type=\"checkbox\"><span></span></label><div><p>Follow a structured DSA path</p></div></li>\n<li data-checked=\"false\" data-type=\"taskItem\"><label><input type=\"checkbox\"><span></span></label><div><p>Build and deploy multiple projects</p></div></li>\n<li data-checked=\"false\" data-type=\"taskItem\"><label><input type=\"checkbox\"><span></span></label><div><p>Actively participate in tech communities</p></div></li>\n</ul>\n"


export default ({text, setText, isEditable}:{text: string, setText?: (text: string) => void, isEditable?: boolean}) => {
  const [editorText, setEditorText] = useState(text)
  useEffect(() => {
    // return () => {
    //   setText && setText("")
  // 
  }, [])
  useEffect(() => {setEditorText(text)}, [text])
  const handleUpdate = useDebouncedCallback((text) => {setText && setText(String(text.editor.getHTML()))}, 500)
  return (
    <EditorProvider slotBefore={isEditable?<MenuBar />:null} shouldRerenderOnTransaction  editable={(isEditable != null)?isEditable:true} editorContainerProps={{className:`${isEditable?'m-1 p-1 editableEditor':''}`}} onUpdate={handleUpdate} extensions={extensions} content={editorText}></EditorProvider>
  )
}