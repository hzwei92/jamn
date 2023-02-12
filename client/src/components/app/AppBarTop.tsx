import { IonButton, IonButtons, IonCard, IonIcon, IonInput, IonPopover } from "@ionic/react"
import { arrowBackOutline, arrowForwardOutline, searchOutline } from "ionicons/icons";
import md5 from "md5";
import { useContext } from "react";
import useLogout from "../../hooks/auth/useLogout";
import { selectIsDone } from "../../redux/authSlice";
import { back, forward, selectPortalIndex, selectPortalStack } from "../../redux/portalSlice";
import { selectCurrentProfile } from "../../redux/profileSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { AppContext } from "./AppProvider";


const AppBarTop = () => {
  const dispatch = useAppDispatch();

  const { isDarkMode, setshowLoginModal } = useContext(AppContext);

  const isDone = useAppSelector(selectIsDone);
  const profile = useAppSelector(selectCurrentProfile);

  const stack = useAppSelector(selectPortalStack);
  const index = useAppSelector(selectPortalIndex);

  const logout = useLogout();
  
  const handleLogoutClick = () => {
    logout();
  }

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
      <div style={{
        display: 'flex',
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
          marginRight: 10,
          display: 'flex',
        }}
          placeholder="Search"
        />
      </div>
      <div style={{
        display: 'flex',
      }}>
        <IonButtons style={{
          display: isDone ? null : 'none',
          marginRight: 5,
        }}>
          {
            !profile
              ? (
                <IonButton onClick={handleLoginClick} style={{
                  borderRadius: 5,
                  border: '1px solid #f4900c',
                  color: '#f4900c',
                }}>
                  LOGIN
                </IonButton>
              )
              : (
                <div>
                  <IonButton id='profileButton'>
                    <img 
                      src={`https://www.gravatar.com/avatar/${md5(profile.email)}?d=retro`}
                      style={{
                        borderRadius: 10,
                        border: `2px solid ${profile.color}`,
                        width: 20,
                        height: 20,
                      }}
                    />
                  </IonButton>
                  <IonPopover trigger='profileButton' triggerAction='click' style={{

                  }}>
                    <div style={{
                      padding: 10,
                    }}>
                      <div style={{
                        marginTop: 5,
                        marginLeft: 5,
                        marginBottom: 5,
                      }}>
                        {profile?.name}
                      </div>
                      <div style={{
                        marginLeft: 5,
                        marginBottom: 10,
                      }}>
                        {profile?.email}
                      </div>
                      <IonButtons>
                        <IonButton onClick={handleLogoutClick} style={{
                          borderRadius: 5,
                          border: '1px solid #f4900c',
                          color: '#f4900c',
                        }}>
                          LOGOUT
                        </IonButton>
                      </IonButtons>
                    </div>
                  </IonPopover>
                </div>
              )
          }
        </IonButtons>
      </div>
    </IonCard>
  );
}

export default AppBarTop;