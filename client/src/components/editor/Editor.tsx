import { EditorState } from "draft-js";
import { RefObject } from "react";
import DraftEditor from "@draft-js-plugins/editor";

import 'draft-js/dist/Draft.css';

interface EditorProps {
  editorRef: RefObject<DraftEditor>;
  editorState: EditorState;
  onChange: (editorState: EditorState) => void;
}

const Editor = ({ editorState, onChange, editorRef }: EditorProps) => {
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