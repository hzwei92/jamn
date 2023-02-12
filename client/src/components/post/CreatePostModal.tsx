import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonIcon, IonModal } from "@ionic/react";
import { EditorState } from "draft-js";
import { closeOutline, send } from "ionicons/icons";
import { useContext, useEffect, useRef, useState } from "react";
import useCreatePost from "../../hooks/post/useCreatePost";
import { selectEntryById } from "../../redux/entrySlice";
import { useAppSelector } from "../../redux/store";
import { AppContext } from "../app/AppProvider";
import EditorComponent from "../editor/Editor";

import DraftEditor from '@draft-js-plugins/editor';

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

  const editorRef = useRef<DraftEditor>(null);

  useEffect(() => {
    if (showCreatePostModal) {
      modalRef.current?.present();
    }
    else {
      modalRef.current?.dismiss();
    }
  }, [showCreatePostModal]);

  const [count, setCount] = useState(0);


  const [editorState, setEditorState] = useState(() => {
    return EditorState.createEmpty();
  });


  const handleOpen = () => {
    editorRef.current?.focus();
  }

  const handleClose = () => {
    setShowCreatePostModal(false);
    setEditorState(EditorState.createEmpty());
    setCount(0);
  };

  const handleSubmit = () => {
    const contentState = editorState.getCurrentContent();
    const text1 = contentState.getPlainText('\n');
    createPost(text1, creationEntry?.postId ?? null, creationDirection);
    handleClose();
  }

  const handleChange = (editorState: EditorState) => {
    setEditorState(editorState);
    const contentState = editorState.getCurrentContent();
    const text = contentState.getPlainText('\n');
    setCount(text.length);
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
            <EditorComponent editorState={editorState} onChange={handleChange} editorRef={editorRef}/>
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