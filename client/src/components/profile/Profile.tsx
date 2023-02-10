import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonContent, IonPage } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import { OFF_WHITE, TAB_HEIGHT } from "../../constants";
import { selectCurrentProfile } from "../../redux/profileSlice";
import { useAppSelector } from "../../redux/store";
import { AppContext } from "../app/AppProvider";


const Profile = () => {
  const { isDarkMode, setshowLoginModal } = useContext(AppContext); 

  const profile = useAppSelector(selectCurrentProfile);

  const handleLoginClick = () => {
    setshowLoginModal(true);
  }

  return (
    <IonPage>
      <IonContent>
        <div style={{
          margin: 0,
          width: '100%',
          height: '100%',
          backgroundColor: isDarkMode
            ? 'black'
            : OFF_WHITE,
          overflowY: 'scroll',  
        }}>
          <IonCard>
            <IonCardHeader>
              <IonButtons>
                <IonButton onClick={handleLoginClick}>
                  LOGIN
                </IonButton>
              </IonButtons>
            </IonCardHeader>
          </IonCard>
          <IonCard>
            <IonCardHeader>
              <div>
                {profile?.name}
              </div>
              <div>
                {profile?.email}
              </div>
            </IonCardHeader>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default Profile;