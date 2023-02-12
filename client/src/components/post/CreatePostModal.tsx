import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonIcon, IonModal } from "@ionic/react";
import { EditorState } from "draft-js";
import { closeOutline, send } from "ionicons/icons";
import { useContext, useEffect, useRef, useState } from "react";
import useCreatePost from "../../hooks/post/useCreatePost";
import { selectEntryById } from "../../redux/entrySlice";
import { useAppSelector } from "../../redux/store";
import { AppContext } from "../app/AppProvider";
import EditorComponent from "../editor/Editor";

const CreatePostModal = () => {
  const { 
    showCreatePostModal,
    setShowCreatePostModal,
    creationEntryId,
    creationDirection,
    editorState,
    setEditorState,
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

  const [text, setText] = useState('');

  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const text1 = contentState.getPlainText('\n');
    setText(text1);
  }, [editorState]);

  const handleOpen = () => {

  }

  const handleClose = () => {
    setShowCreatePostModal(false);
    setEditorState(EditorState.createEmpty());
  };

  const handleSubmit = () => {
    createPost(text, creationEntry?.postId ?? null, creationDirection);
    handleClose();
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
          <IonButton color='warning' disabled={text.length > 420} onClick={handleSubmit}>
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
            <EditorComponent />
          </div>
          <div style={{
            margin: 15,
            marginLeft: 20,
            color: text.length > 420
              ? 'red'
              : undefined,
          }}>
            { text.length } / 420
          </div>
        </IonCardContent>
      </IonCard>
    </IonModal>
  );
};

export default CreatePostModal;