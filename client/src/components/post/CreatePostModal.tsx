import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonIcon, IonModal } from "@ionic/react";
import { closeOutline, send } from "ionicons/icons";
import { useContext, useEffect, useRef, useState } from "react";
import useCreatePost from "../../hooks/post/useCreatePost";
import { selectEntryById } from "../../redux/entrySlice";
import { useAppSelector } from "../../redux/store";
import { AppContext } from "../app/AppProvider";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { serialize } from "../../utils";
import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';

type CustomElement = { type: string; children: CustomText[] }
type CustomText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

const initialValue = [{
  type: 'paragraph',
  children: [{ text: '' }],
}];

const CreatePostModal = () => {
  const { 
    showCreatePostModal,
    setShowCreatePostModal,
    creationEntryId,
    creationDirection,
  } = useContext(AppContext);

  const creationEntry = useAppSelector(state => selectEntryById(state, creationEntryId));

  const createPost = useCreatePost();

  const modalRef = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    if (showCreatePostModal) {
      modalRef.current?.present();
    }
    else {
      modalRef.current?.dismiss();
    }
  }, [showCreatePostModal]);

  const [count, setCount] = useState(0);

  const [editor] = useState(() => withReact(withHistory(createEditor())));

  const handleOpen = () => {
    ReactEditor.focus(editor);
  }

  const handleClose = () => {
    setShowCreatePostModal(false);
    editor.children = [{
      type: 'paragraph',
      children: [{ text: '' }],
    }];
    editor.onChange();
    setCount(0);
  };

  const handleSubmit = () => {
    const text = serialize(editor.children);
    createPost(text, creationEntry?.postId ?? null, creationDirection);
    handleClose();
  }

  const handleChange = (value: Descendant[]) => {
    const isAstChange = editor.operations.some(op => op.type !== 'set_selection');
    if (isAstChange) {
      const text = serialize(value);
      setCount(text.length);
    }
  }

  return (
    <IonModal ref={modalRef} onDidPresent={handleOpen} onWillDismiss={handleClose}>
      <IonCard style={{
        margin: 0,
        height: '100%',
      }}>
        <IonCardHeader  style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
          <IonButtons>
            <IonButton onClick={handleClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonButton color='warning' disabled={count > 420} onClick={handleSubmit}>
            <IonIcon icon={send} style={{
              color: 'white'
            }}/>
          </IonButton>
        </IonCardHeader>
        <IonCardContent>
          <div style={{
            margin: 0,
            border: '1px solid',
            borderRadius: 5,
            padding: 20,
          }}>
            <Slate editor={editor} value={initialValue} onChange={handleChange}>
              <Editable
                placeholder="What's happening?"
              />
            </Slate>
          </div>
          <div style={{
            margin: 15,
            marginLeft: 20,
            color: count > 420
              ? 'red'
              : undefined,
          }}>
            { count } / 420
          </div>
        </IonCardContent>
      </IonCard>
    </IonModal>
  );
};

export default CreatePostModal;