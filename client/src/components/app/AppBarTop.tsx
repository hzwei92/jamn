import { IonButton, IonButtons, IonCard, IonIcon, IonInput, IonItem } from "@ionic/react"
import { arrowBack, arrowBackOutline, arrowForward, arrowForwardOutline, personCircle, search, searchOutline } from "ionicons/icons";
import { useContext } from "react";
import { back, forward, selectPortalIndex, selectPortalStack } from "../../redux/portalSlice";
import { selectCurrentProfile } from "../../redux/profileSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { AppContext } from "./AppProvider";


const AppBarTop = () => {
  const dispatch = useAppDispatch();

  const { isDarkMode, setshowLoginModal } = useContext(AppContext);

  const profile = useAppSelector(selectCurrentProfile);

  const stack = useAppSelector(selectPortalStack);
  const index = useAppSelector(selectPortalIndex);

  const handleLoginClick = () => {
    setshowLoginModal(true);
  }

  const handleBackClick = () => {
    dispatch(back());
  }

  const handleForwardClick = () => {
    dispatch(forward());
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
      <IonButtons style={{
        marginLeft: 5,
      }}>
        <IonButton disabled={index <= 0}onClick={handleBackClick}>
          <IonIcon icon={arrowBackOutline} />
        </IonButton>
        <IonButton disabled={index >= stack.length - 1} onClick={handleForwardClick}>
          <IonIcon icon={arrowForwardOutline} />
        </IonButton>
        <IonButton>
          <IonIcon icon={searchOutline} />
        </IonButton>
      </IonButtons>
      <IonInput style={{
        marginLeft: 5,
        marginRight: 10,
        display: 'flex',
      }}
        placeholder="Search"
      />
    </IonCard>
  );
}

export default AppBarTop;