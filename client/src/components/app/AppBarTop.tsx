import { IonButton, IonButtons, IonCard, IonIcon, IonInput, IonItem } from "@ionic/react"
import { personCircle, search } from "ionicons/icons";
import { useContext } from "react";
import { selectCurrentProfile } from "../../redux/profileSlice";
import { useAppSelector } from "../../redux/store";
import { AppContext } from "./AppProvider";


const AppBarTop = () => {
  const { isDarkMode, setshowLoginModal } = useContext(AppContext);

  const profile = useAppSelector(selectCurrentProfile);

  const handleLoginClick = () => {
    setshowLoginModal(true);
  }

  return (
    <IonCard style={{
      margin: 0,
      borderRadius: 0,
      borderLeft: '1px solid',
      borderBottom: '1px solid',
      borderColor: isDarkMode
        ? '#222222'
        : 'lavender',
      width: '100%',
      height: 50,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      boxShadow: 'none',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        padding: 5,
      }}>
        <IonButtons>
          <IonButton>
            <IonIcon icon={search} />
          </IonButton>
        </IonButtons>
        <IonInput
          placeholder="Search"
        />
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        justifyContent: 'right',
      }}>
      </div>
    </IonCard>
  );
}

export default AppBarTop;