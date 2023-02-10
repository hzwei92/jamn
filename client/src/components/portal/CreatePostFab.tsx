import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { add, addOutline, close } from "ionicons/icons";
import { useContext } from "react";
import { selectPostById } from "../../redux/postSlice";
import { selectCurrentProfile } from "../../redux/profileSlice";
import { useAppSelector } from "../../redux/store";
import { PostDirection } from "../../enums";
import { AppContext } from "../app/AppProvider";


const CreatePostFab = () => {
  const { setShowCreatePostModal, connectionPostIds, setConnectionPostIds, editorRef } = useContext(AppContext);

  const profile = useAppSelector(selectCurrentProfile);

  const handleCreatePostClick = () => {
    setConnectionPostIds([]);
    setShowCreatePostModal(true);
    setTimeout(() => {
      editorRef.current?.focus();
    }, 100);
  }

  const handleCancelClick = () => {
    setConnectionPostIds([]);
  }

  return (
    <IonFab style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      display: !!profile
        ? 'flex'
        : 'none'
    }}>
      <IonFabButton
        size='small'
        onClick={handleCancelClick}
        style={{
          display: connectionPostIds.length > 0
            ? null
            : 'none',
        }}
      >
        <IonIcon icon={close} size='small' />
      </IonFabButton>
      <IonFabButton 
        color='warning'
        onClick={handleCreatePostClick}
        style={{
          display: connectionPostIds.length > 0
            ? 'none'
            : null,
        }}
      >
        <IonIcon icon={addOutline} style={{
          color: 'white'
        }}/>
      </IonFabButton>
    </IonFab>
  )
}

export default CreatePostFab;