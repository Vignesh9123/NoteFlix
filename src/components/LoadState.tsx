import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import React, { useEffect } from 'react'

function LoadState() {
    const text = '{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Bold ","type":"text","version":1},{"detail":0,"format":2,"mode":"normal","style":"","text":"Italic ","type":"text","version":1},{"detail":0,"format":8,"mode":"normal","style":"","text":"Underlined","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'

    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        const newState = editor.parseEditorState(text);
        editor.setEditorState(newState);
    })
  return (
    <div>
      
    </div>
  )
}

export default LoadState
