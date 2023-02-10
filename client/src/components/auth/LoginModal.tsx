import { IonCard, IonCardContent, IonCardHeader, IonModal } from "@ionic/react"
import { useContext, useEffect, useRef } from "react"
import { AppContext } from "../app/AppProvider";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google"; 
import useLoginProfile from "../../hooks/auth/useLogin";

const LoginModal = () => {
  const loginProfile = useLoginProfile();

  const {
    showLoginModal,
    setshowLoginModal,
  } = useContext(AppContext);

  const modalRef = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    if (showLoginModal) {
      modalRef.current?.present();
    } else {
      modalRef.current?.dismiss();
    }
  }, [showLoginModal]);


  const handleClose = () => {
    setshowLoginModal(false);
  }
  
  const handleSuccess = (response: CredentialResponse) => {
    handleClose();
    if (response.credential) {
      loginProfile(response.credential);
    }
  }

  const handleError = () => {
    handleClose();
    console.log('error');
  }

  return (
    <IonModal ref={modalRef} onWillDismiss={handleClose}>
      <IonCard style={{
        margin: 0,
        height: '100%',
      }}>
        <IonCardContent style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              useOneTap={true}
            />
          </div>
        </IonCardContent>
      </IonCard>
    </IonModal>
  )
}

export default LoginModal;