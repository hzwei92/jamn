import { IonButton, IonButtons, IonIcon } from "@ionic/react"
import { checkmarkOutline, copyOutline, duplicateOutline, linkOutline, moveOutline } from "ionicons/icons";
import { useContext } from "react"
import { OFF_WHITE } from "../../constants";
import { selectCurrentProfile } from "../../redux/profileSlice";
import { useAppSelector } from "../../redux/store";
import { AppContext } from "../app/AppProvider"

interface PostConnectProps {
  postId: string;
}

const PostConnect = ({ postId }: PostConnectProps) => {
  const { connectionPostIds, setConnectionPostIds, isDarkMode } = useContext(AppContext);

  const profile = useAppSelector(selectCurrentProfile);

  const isConnecting = connectionPostIds.some(id => id === postId);

  const handleClick = () => {
    if (isConnecting) {
      setConnectionPostIds(connectionPostIds.filter(id => id !== postId));
    }
    else {
      setConnectionPostIds([postId]);
    }
  }

  return (
    <IonButtons style={{
      display: !!profile
        ? 'flex'
        : 'none',
    }}>
      <IonButton onClick={handleClick} style={{
        borderRadius: 5,
        backgroundColor: isConnecting
          ? isDarkMode
            ? OFF_WHITE
            : 'black'
          : null,
        color: isConnecting
          ? isDarkMode
            ? 'black'
            : OFF_WHITE
          : '#f4900c',
        border: isConnecting 
          ? null
          : '1px solid #f4900c',
      }}>
        <IonIcon icon={isConnecting ? checkmarkOutline : copyOutline} style={{
          transform: 'scale(0.8)'
        }}/>
      </IonButton>
    </IonButtons>
  )
}


export default PostConnect;