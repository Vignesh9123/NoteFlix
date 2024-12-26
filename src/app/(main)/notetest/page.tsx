'use client'
import Editor from "@/components/TipTap";
import React, { useEffect, useState } from 'react'

function NoteTestPage() {
  const [text, setText] = useState('')

  return (
    <div>
      <Editor text={text} setText={setText} isEditable={true}/>
    </div>
  )
}

export default NoteTestPage
