'use client'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import {Placeholder} from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect } from 'react'
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


const content = `
<h2>Hi there,</h2><p>this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:</p><ul><li><p>That’s a bullet list with one …</p></li><li><p>… or two list items.</p></li></ul><p>Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:</p><pre><code class="language-css">body {
    display: none;
    }</code></pre><p>I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.</p><blockquote><p>Wow, that’s amazing. Good work, boy! 👏 <br>— Momma</p><p><s>dddd Burt np</s></p></blockquote><ul data-type="taskList"><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>flour</p></div></li><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>baking powder</p></div></li><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>salt</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>sugar</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>milk</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>eggs</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>butter</p></div></li></ul><p></p><pre><code class="language-js">console.log("Hello world");</code></pre><p></p>
    `

export default ({text, setText, isEditable}:{text: string, setText?: (text: string) => void, isEditable?: boolean}) => {
  useEffect(() => {
    return () => {
      setText && setText("")
    }
  }, [])
  const handleUpdate = useDebouncedCallback((text) => {setText && setText(String(text.editor.getHTML()))}, 500)
  return (
    <EditorProvider slotBefore={isEditable?<MenuBar />:null} editable={(isEditable != null)?isEditable:true} editorContainerProps={{className:`${isEditable?'m-1 p-1 editableEditor':''}`}} onUpdate={handleUpdate} extensions={extensions} content={text}></EditorProvider>
  )
}