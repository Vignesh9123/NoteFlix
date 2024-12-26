"use client"
import React, {useCallback, useEffect, useState} from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, CAN_UNDO_COMMAND, CAN_REDO_COMMAND,UNDO_COMMAND, REDO_COMMAND, FORMAT_TEXT_COMMAND } from 'lexical';
import {useDebouncedCallback} from 'use-debounce'
import { Separator } from './ui/separator';
import { Bold, Italic, Redo, Underline, Undo } from 'lucide-react';
function Toolbars({text, setText}:{text:string, setText:(text:string) => void}) {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderlined, setIsUnderlined] = useState(false);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const $updateToolbar = useCallback(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Update text format
        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderlined(selection.hasFormat('underline'));
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
        editor.registerCommand(
          CAN_UNDO_COMMAND,
          (payload) => {
            setCanUndo(payload);
            return false;
          },
          1,
        ),
        editor.registerCommand(
          CAN_REDO_COMMAND,
          (payload) => {
            setCanRedo(payload);
            return false;
          },
          1,
        )
    }, [editor, $updateToolbar]);
    const handleSave = useDebouncedCallback((content) => {
      setText(content)
    }, 500)
  return (
    <div className='flex gap-2 my-2 rounded-md'>
      <button className={`px-2 ${isBold?'bg-muted':''}`} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}><Bold/></button>
      <button className={`px-2 ${isItalic?'bg-muted':''}`} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}><Italic/></button>
      <button className={`px-2 ${isUnderlined?'bg-muted':''}`} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}><Underline/></button>
      <Separator orientation='vertical' className='h-auto bg-muted-foreground' />
      <button className='px-2 hover:bg-muted'
      disabled={!canUndo}
      onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
        <Undo/>
      </button>
      <button className='px-2 hover:bg-muted disabled:hover:bg-transparent'
      disabled={!canRedo}
      onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}><Redo/></button>
    </div>
  )
}

export default Toolbars
