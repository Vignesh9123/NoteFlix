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
<h2>JavaScript Classes and Object-Oriented Programming</h2>\n\n<p>This document provides a basic overview of JavaScript classes and their implementation within the context of object-oriented programming (OOP).  While JavaScript is primarily prototype-based, classes introduced in ES6 (ECMAScript 2015) offer a more familiar syntax for developers experienced with class-based languages like Java and C++.  These classes are essentially \"syntactic sugar,\" providing a cleaner way to work with prototypes.</p>\n\n<p><strong>Core Concepts:</strong></p>\n<ul>\n<li><p><strong>Objects:</strong>  Objects are collections of properties (variables) and methods (functions).  They are the fundamental building blocks of OOP.</p></li>\n<li><p><strong>Object Literals:</strong> A simple way to create objects using key-value pairs (e.g., \"John\", age: 30 ).</p></li>\n<li><p><strong>Constructor Functions:</strong> Functions used to create multiple instances of objects.  They use the new keyword and the this keyword to refer to the newly created object.</p></li>\n<li><p><strong>Prototypes:</strong>  Underlying mechanism in JavaScript for inheritance. Classes leverage prototypes behind the scenes.</p></li>\n<li><p><strong>Classes (ES6+):</strong> Provide a structured way to define blueprints for objects, making code more organized and readable.  They encapsulate properties and methods within a single unit.</p></li>\n<li><p><strong>Four Pillars of OOP:</strong> Abstraction, Encapsulation, Inheritance, and Polymorphism (explained briefly in the original text).</p></li>\n</ul>\n\n<p><strong>this Keyword and Context:</strong> Understanding the this keyword's context (whether it's within a global context, an object literal, a constructor function, or a class method) is crucial for proper object instantiation and behavior.</p>\n\n<p><strong>Example:  Constructor Function</strong></p>\n<pre><code class=\"language-javascript\">\nfunction User(username, isLoggedIn) {\n  this.username = username;\n  this.isLoggedIn = isLoggedIn;\n  this.getLoginStatus = function() {\n    return this.isLoggedIn;\n  };\n}\n</code></pre>\n\n<p><strong>Using Classes:</strong>  The original text mentions using classes for a more structured approach to building objects, improving code readability and maintainability compared to constructor functions.</p>\n\n<p><strong>Further Exploration:</strong> The original text suggests exploring topics like getters/setters, fetch API usage within the context of OOP, and managing execution context. These concepts are important for advanced object-oriented programming in JavaScript.</p>\n\n\n<ul data-type=\"taskList\">\n<li data-checked=\"false\" data-type=\"taskItem\"><label><input type=\"checkbox\"><span></span></label><div><p>Further research on JavaScript prototype inheritance</p></div></li>\n<li data-checked=\"false\" data-type=\"taskItem\"><label><input type=\"checkbox\"><span></span></label><div><p>Implement a more complex example using classes and inheritance</p></div></li>\n<li data-checked=\"false\" data-type=\"taskItem\"><label><input type=\"checkbox\"><span></span></label><div><p>Explore the use of getters and setters in JavaScript classes</p></div></li>\n<li data-checked=\"false\" data-type=\"taskItem\"><label><input type=\"checkbox\"><span></span></label><div><p>Practice working with the this keyword in different contexts</p></div></li>\n\n</ul>\n<pre><code class=\"language-javascript\">\nconsole.log(\"Understanding JavaScript OOP\");\n</code></pre>\n\n`

export default ({text, setText, isEditable}:{text: string, setText?: (text: string) => void, isEditable?: boolean}) => {
  useEffect(() => {
    return () => {
      setText && setText("")
    }
  }, [])
  const handleUpdate = useDebouncedCallback((text) => {setText && setText(String(text.editor.getHTML()))}, 500)
  return (
    <EditorProvider slotBefore={isEditable?<MenuBar />:null} editable={(isEditable != null)?isEditable:true} editorContainerProps={{className:`${isEditable?'m-1 p-1 editableEditor':''}`}} onUpdate={handleUpdate} extensions={extensions} content={content}></EditorProvider>
  )
}