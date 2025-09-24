"use client";

import React from "react";
import dynamic from "next/dynamic";
import {type MDXEditorMethods} from "@mdxeditor/editor";
import InitializedMDXEditor from "./InitializedMDXEditor";
import "@mdxeditor/editor/style.css";
import "./dark-editor.css";

type EditorProps = Omit<
  React.ComponentProps<typeof InitializedMDXEditor>,
  "editorRef"
>;

const ImportedEditor = dynamic(() => import("./InitializedMDXEditor"), {
  ssr: false,
});

export const Editor = React.forwardRef<MDXEditorMethods, EditorProps>(
  (props, ref) => (
    <ImportedEditor
      {...props}
      editorRef={ref}
    />
  ),
);

Editor.displayName = "Editor";
