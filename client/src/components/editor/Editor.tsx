import { EditorState } from "draft-js";
import { useContext, useEffect, useState } from "react";
import DraftEditor from "@draft-js-plugins/editor";

import 'draft-js/dist/Draft.css';
import { AppContext } from "../app/AppProvider";

const Editor = () => {
  const { editorState, setEditorState, editorRef } = useContext(AppContext);
  
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
        spellCheck={true}
      />
    </div>
  );
};

export default Editor;