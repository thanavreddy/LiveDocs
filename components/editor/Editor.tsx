"use client";
import Theme from "./plugins/Theme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import {HeadingNode} from '@lexical/rich-text'
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import React from "react";
import {  FloatingComposer, FloatingThreads, liveblocksConfig, LiveblocksPlugin, useEditorStatus } from "@liveblocks/react-lexical";
import { liveblocks } from "@/lib/liveblocks";
import Loader from "../Loader";
import FloatingToolbar from "./plugins/FloatingToolBarPlugin";
import { useThreads } from "@liveblocks/react/suspense";
import Comments from "../Comments";


function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

export function Editor({
  roomId,
  currentUserType,
}: {
  roomId: String;
  currentUserType: UserType;
}) {


  const  {threads} = useThreads();
  const initialConfig = liveblocksConfig({
    namespace: "Editor",
    nodes: [HeadingNode],
    onError: (error: Error) => {
      console.error(error);
      throw error;
    },
    theme: Theme,
    editable: currentUserType === "editor",
  });
  const status = useEditorStatus();
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container size-full">
        <div className="toolbar-wrapper flex min-w-full justify-between">
          <ToolbarPlugin />
          {/* {currentUserType === 'editor' && <DeleteModal roomId={roomId}/>} */}
        </div>

        <div className="editor-wrapper flex flex-col items-center justify-start ">
          {status === "not-loaded" || status === "loading" ? (
            <Loader />
          ) : (
            <div className="editor-inner min-h-[1100px] relative h-fit w-full max-w-[800px] shadow-md lg:mb-10">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="editor-input h-full" />
                }
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary}
              />

              {currentUserType === 'editor' && <FloatingToolbar/>  }
              <HistoryPlugin />
              <AutoFocusPlugin />
            </div>
          )}
          <LiveblocksPlugin>

            <FloatingComposer className="w-[350px]" />
            <FloatingThreads threads={threads}/>
            <Comments/>
          </LiveblocksPlugin>
        </div>
      </div>
    </LexicalComposer>
  );
}
