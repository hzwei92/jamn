import { EditorState } from "draft-js";
import { useContext, useState } from "react";
import DraftEditor from "@draft-js-plugins/editor";

import 'draft-js/dist/Draft.css';
import { AppContext } from "../app/AppProvider";

interface EditorProps {
  editorRef: any;
}
const Editor = ({ editorRef }: EditorProps) => {
  const { editorState, setEditorState,  } = useContext(AppContext);
  
  const onChange = (editorState: EditorState) => {
    setEditorState(editorState);
  };

  return (
    <div className="editor">
      <DraftEditor
        ref={editorRef}
        editorState={editorState}
        onChange={onChange}
        placeholder="What's happening?"
      />
    </div>
  );
};

export default Editor;