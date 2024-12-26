"use client"
import {$getRoot, $getSelection} from 'lexical';
import {useEffect} from 'react';

import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import Toolbars from './Toolbars';
import LoadState from './LoadState';
const placeholder = 'Enter some text...';
const theme = {
  // Theme styling goes here
  //...
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
  console.error(error);
}

export default function Editor({text, setText, loadText}:{text?:string, setText?:(text:string) => void, loadText?:string}) {
  const initialConfig = {
    namespace: 'MyEditor',
    theme: exampleTheme,
    onError,
    
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      {!loadText && <Toolbars text={text!} setText={setText!}/>}
      <div className="relative">

      <RichTextPlugin
        contentEditable={<ContentEditable contentEditable={!loadText} className="outline-none bg-muted m-1 max-h-[200px] overflow-auto rounded-lg p-1 relative" aria-placeholder={placeholder} placeholder={<div className=" absolute top-1 left-2 ">{placeholder}</div>}/>}
        ErrorBoundary={LexicalErrorBoundary}
        />
      <HistoryPlugin />
      {loadText && <LoadState loadText={loadText}/>}
      <AutoFocusPlugin />
        </div>
    </LexicalComposer>
  );
}

const exampleTheme = {
    ltr: 'ltr',
    rtl: 'rtl',
    paragraph: 'editor-paragraph',
    quote: 'editor-quote',
    heading: {
      h1: 'editor-heading-h1',
      h2: 'editor-heading-h2',
      h3: 'editor-heading-h3',
      h4: 'editor-heading-h4',
      h5: 'editor-heading-h5',
      h6: 'editor-heading-h6',
    },
    list: {
      nested: {
        listitem: 'editor-nested-listitem',
      },
      ol: 'editor-list-ol',
      ul: 'editor-list-ul',
      listitem: 'editor-listItem',
      listitemChecked: 'editor-listItemChecked',
      listitemUnchecked: 'editor-listItemUnchecked',
    },
    hashtag: 'editor-hashtag',
    image: 'editor-image',
    link: 'editor-link',
    text: {
      bold: 'font-bold',
      code: 'editor-textCode',
      italic: 'italic',
      strikethrough: 'editor-textStrikethrough',
      subscript: 'editor-textSubscript',
      superscript: 'editor-textSuperscript',
      underline: 'underline',
      underlineStrikethrough: 'editor-textUnderlineStrikethrough',
    },
    code: 'editor-code',
    codeHighlight: {
      atrule: 'editor-tokenAttr',
      attr: 'editor-tokenAttr',
      boolean: 'editor-tokenProperty',
      builtin: 'editor-tokenSelector',
      cdata: 'editor-tokenComment',
      char: 'editor-tokenSelector',
      class: 'editor-tokenFunction',
      'class-name': 'editor-tokenFunction',
      comment: 'editor-tokenComment',
      constant: 'editor-tokenProperty',
      deleted: 'editor-tokenProperty',
      doctype: 'editor-tokenComment',
      entity: 'editor-tokenOperator',
      function: 'editor-tokenFunction',
      important: 'editor-tokenVariable',
      inserted: 'editor-tokenSelector',
      keyword: 'editor-tokenAttr',
      namespace: 'editor-tokenVariable',
      number: 'editor-tokenProperty',
      operator: 'editor-tokenOperator',
      prolog: 'editor-tokenComment',
      property: 'editor-tokenProperty',
      punctuation: 'editor-tokenPunctuation',
      regex: 'editor-tokenVariable',
      selector: 'editor-tokenSelector',
      string: 'editor-tokenSelector',
      symbol: 'editor-tokenProperty',
      tag: 'editor-tokenProperty',
      url: 'editor-tokenOperator',
      variable: 'editor-tokenVariable',
    },
  };