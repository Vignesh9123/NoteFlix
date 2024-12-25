"use client"
import React, {useCallback, useEffect, useState} from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, CAN_UNDO_COMMAND, CAN_REDO_COMMAND, FORMAT_TEXT_COMMAND } from 'lexical';
import {useDebouncedCallback} from 'use-debounce'
function Toolbars() {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);

    const $updateToolbar = useCallback(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Update text format
        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
      }
    }, []);
    
    useEffect(() => {
     
        editor.registerUpdateListener(({editorState, dirtyElements, dirtyLeaves}) => {
          editorState.read(() => {
            $updateToolbar();
        });
        if(dirtyElements.size > 0 || dirtyLeaves.size > 0) {
          handleSave(JSON.stringify(editorState))
        }
        });
    }, [editor, $updateToolbar]);
    const handleSave = useDebouncedCallback((content) => {
      console.log(content);
    }, 500)
  return (
    <div className='flex gap-2'>
      <button className={`${isBold?'bg-muted':''}`} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>B</button>
      <button className={`${isItalic?'bg-muted':''}`} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>I</button>
      <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}>U</button>
    </div>
  )
}

export default Toolbars
