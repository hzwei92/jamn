import { IonButton, IonButtons, IonCard, IonIcon, isPlatform, useIonRouter } from "@ionic/react"
import { apertureOutline, mapOutline, moonOutline, notificationsOutline, peopleOutline, personCircleOutline, sunnyOutline } from "ionicons/icons";
import { useContext, useState } from "react";
import { selectCurrentProfile } from "../../redux/profileSlice";
import { useAppSelector } from "../../redux/store";
import { AppContext } from "./AppProvider";
import icon from './favicon.png';

export enum Mode {
  NONE = 'NONE',
  PORTAL = 'PORTAL',
  PROFILE = 'PROFILE',
  CONTACTS = 'CONTACTS',
}


const AppBarLeft = () => {
  const router = useIonRouter();

  const path = router.routeInfo.pathname.split('/');

  const { isDarkMode, setIsDarkMode } = useContext(AppContext);

  const [label, setLabel] = useState<Mode>(Mode.NONE);

  const handleMenuMouseEnter = (mode: Mode) => () => {
    setLabel(mode);
  }
  const handleMenuMouseLeave = () => {
    setLabel(Mode.NONE);
  }

  const handleMenuClick = (m: Mode) => () => {
    
  }

  return (
    <IonCard style={{
      margin: 0,
      borderRadius: 0,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      minHeight: '100%',
      width: 50,
      overflow: 'visible',
      zIndex: 100,
    }}>
      <IonButtons style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        <IonButton
          style={{
            height: 50,
            width: 50,
          }}
        >
          <img src={icon} style={{
            transform: 'scale(.85)',
          }} />
        </IonButton>
        <IonButton
          onMouseEnter={handleMenuMouseEnter(Mode.PORTAL)}
          onMouseLeave={handleMenuMouseLeave}
          onClick={handleMenuClick(Mode.PORTAL)}
          style={{
            width: 50,
            height: 50,
            borderLeft: path[1] === 'portal'
              ? '5px solid'
              : null,
          }}
        >
          <IonIcon icon={apertureOutline}/>
        </IonButton>
        <IonButton
          onMouseEnter={handleMenuMouseEnter(Mode.PROFILE)}
          onMouseLeave={handleMenuMouseLeave}
          onClick={handleMenuClick(Mode.PROFILE)}
          style={{
            width: 50,
            height: 50,
            borderLeft: path[1] === 'profile'
              ? '5px solid'
              : null,
          }}
        >
          <IonIcon icon={mapOutline} />
        </IonButton>
        <IonButton
          onMouseEnter={handleMenuMouseEnter(Mode.CONTACTS)}
          onMouseLeave={handleMenuMouseLeave}
          onClick={handleMenuClick(Mode.CONTACTS)}
          style={{
            height: 50,
            width: 50,
            borderLeft: path[1] === 'contacts'
              ? '5px solid'
              : null,
          }}
        >
          <IonIcon icon={notificationsOutline} />
        </IonButton>
      </IonButtons>
      <IonButtons style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        <IonButton onClick={() => setIsDarkMode(val => !val)} style={{
          height: 50,
          width: 50,
        }}>
          <IonIcon
            icon={isDarkMode ? moonOutline : sunnyOutline}
            style={{
              transform: isDarkMode
                ? 'scale(.75)'
                : null,
            }}
          />
        </IonButton>
      </IonButtons>
      <IonCard style={{
        display: label === Mode.PORTAL && !isPlatform('mobile')
          ? 'block'
          : 'none',
        position: 'absolute',
        left: 45,
        top: 50,
        padding: 5,
        border: `1px solid`,
      }}>
        PORTAL
      </IonCard>
      <IonCard style={{
        display: label === Mode.PROFILE && !isPlatform('mobile')
          ? 'block'
          : 'none',
        position: 'absolute',
        left: 45,
        top: 100,
        padding: 5,
        border: `1px solid`,
      }}>
        PROFILE
      </IonCard>
      <IonCard style={{
        display: label === Mode.CONTACTS && !isPlatform('mobile')
          ? 'block'
          : 'none',
        position: 'absolute',
        left: 45,
        top: 150,
        padding: 5,
        border: `1px solid`,
      }}>
        CONTACTS
      </IonCard>
    </IonCard>
  )
}

export default AppBarLeft;