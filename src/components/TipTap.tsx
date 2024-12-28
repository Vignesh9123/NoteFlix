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
      <div className="button-group flex flex-wrap gap-4">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          className={`p-2 ${editor.isActive('bold') ? 'bg-muted' : ''}`}
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
          className={`p-2 ${editor.isActive('italic') ? 'bg-muted' : ''}`}
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
          className={`p-2 ${editor.isActive('code') ? 'bg-muted' : ''}`}
        >
          <Code />
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()} title='Remove formatting'>
          <RemoveFormatting />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 ${editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 ${editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 ${editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}`}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 ${editor.isActive('bulletList') ? 'bg-muted' : ''}`}
        >
          <List />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 ${editor.isActive('orderedList') ? 'bg-muted' : ''}`}
        >
          <ListOrdered />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 ${editor.isActive('codeBlock') ? 'bg-muted' : ''}`}
        >
          Code Block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 ${editor.isActive('blockquote') ? 'bg-muted' : ''}`}
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
          className={`p-2 ${editor.isActive('taskList') ? 'bg-muted' : ''}`}
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


const content = "<h2>Level Up Your Coding in 2023</h2>\n\n<p>This video outlines eight essential coding habits to cultivate for a successful career.  Adopting these early will have significant long-term benefits.</p>\n\n<ul>\n<li><p><strong>Master Multiple Languages and Frameworks:</strong> Don't specialize too early.  Focus on strong fundamentals and be adaptable to various technologies. Frameworks change rapidly, so adaptability is key.</p></li>\n<li><p><strong>Become a Terminal Pro:</strong>  Spend more time using the command line interface (CLI).  This enhances efficiency and is crucial for server-side work where GUIs are unavailable. Consider using WSL (Windows Subsystem for Linux) on Windows machines for better compatibility with Linux commands.</p></li>\n<li><p><strong>Embrace Version Control (Git & GitHub):</strong> Utilize Git for version control and GitHub for hosting repositories.  This provides backups, facilitates collaboration, and builds your portfolio.</p></li>\n<li><p><strong>Implement CI/CD (Continuous Integration/Continuous Deployment):</strong> Automate the deployment process. Services like Vercel simplify deploying static websites.  Learn how to integrate CI/CD for more complex projects.</p></li>\n<li><p><strong>Contribute to Open Source:</strong> Participate in open-source projects on GitHub. This provides valuable experience and strengthens your portfolio.</p></li>\n<li><p><strong>Join the Right Communities:</strong> Engage in relevant online communities and resources to stay updated and learn from others.  However, be mindful of time management.</p></li>\n<li><p><strong>Maintain a Learning List:</strong> Create a curated list of blog posts and learning resources you want to explore. Open-source this list on GitHub for better organization and tracking.</p></li>\n<li><p><strong>Step Outside Your Comfort Zone:</strong> Continuously learn new technologies and approaches to stay relevant and improve your skills.</p></li>\n</ul>\n\n<p>The video includes practical demonstrations using Git, GitHub, and Vercel, showcasing the suggested habits in action.</p>\n\n<ul data-type=\"taskList\">\n<li data-checked=\"false\" data-type=\"taskItem\"><label><input type=\"checkbox\"><span></span></label><div><p>Learn basic Git commands.</p></div></li>\n<li data-checked=\"false\" data-type=\"taskItem\"><label><input type=\"checkbox\"><span></span></label><div><p>Create a GitHub account and start a repository.</p></div></li>\n<li data-checked=\"false\" data-type=\"taskItem\"><label><input type=\"checkbox\"><span></span></label><div><p>Explore and use a CI/CD service (like Vercel).</p></div></li>\n<li data-checked=\"false\" data-type=\"taskItem\"><label><input type=\"checkbox\"><span></span></label><div><p>Contribute to at least one open-source project.</p></div></li>\n<li data-checked=\"false\" data-type=\"taskItem\"><label><input type=\"checkbox\"><span></span></label><div><p>Create your personal learning list on GitHub.</p></div></li>\n\n</ul>\n"


export default ({text, setText, isEditable}:{text: string, setText?: (text: string) => void, isEditable?: boolean}) => {
  const [editorText, setEditorText] = useState(text)
  useEffect(() => {
    return () => {
      setText && setText("")
    }
  }, [])
  useEffect(() => {setEditorText(text)}, [text])
  const handleUpdate = useDebouncedCallback((text) => {setText && setText(String(text.editor.getHTML()))}, 500)
  return (
    <EditorProvider slotBefore={isEditable?<MenuBar />:null} shouldRerenderOnTransaction  editable={(isEditable != null)?isEditable:true} editorContainerProps={{className:`${isEditable?'m-1 p-1 editableEditor':''}`}} onUpdate={handleUpdate} extensions={extensions} content={editorText}></EditorProvider>
  )
}