import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonIcon, IonModal } from "@ionic/react";
import { EditorState } from "draft-js";
import { close, send } from "ionicons/icons";
import { useContext, useEffect, useRef, useState } from "react";
import useCreatePost from "../../hooks/post/useCreatePost";
import { useAppSelector } from "../../redux/store";
import { AppContext } from "../app/AppProvider";
import Editor from "../editor/Editor";

const CreatePostModal = () => {
  const createPost = useCreatePost();

  const { 
    showCreatePostModal,
    setShowCreatePostModal,
    creationPostId,
    setCreationPostId,
    creationDirection,
    setCreationDirection,
    editorState,
    setEditorState,
  } = useContext(AppContext);


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

  const handleClose = () => {
    setShowCreatePostModal(false);
    setCreationPostId(null);
    setCreationDirection(null);
    setEditorState(EditorState.createEmpty());
  };

  const handleSubmit = () => {
    createPost(text, creationPostId, creationDirection);
    handleClose();
  }

  return (
    <IonModal ref={modalRef} onWillDismiss={handleClose}>
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
              <IonIcon icon={close} />
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
            <Editor/>
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