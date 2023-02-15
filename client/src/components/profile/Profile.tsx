import { IonButton, IonButtons, IonCard, IonIcon } from "@ionic/react";
import { arrowBackCircleOutline, arrowDownCircleOutline, arrowForwardCircleOutline, arrowUpCircleOutline, chevronUpOutline, documentOutline, easelOutline, scanOutline, settingsOutline, shareOutline } from "ionicons/icons";
import md5 from "md5";
import { ORANGE } from "../../constants";
import { pushPortalSlice, selectPortalSlice } from "../../redux/portalSlice";
import { selectCurrentProfile, selectProfileById } from "../../redux/profileSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { PortalSlice } from "../../types/portal";
import ProfileDirections from "./ProfileDirections";

interface ProfileProps {
  entryId: string;
  profileId: string;
  depth: number;
}

const Profile = ({ entryId, profileId, depth}: ProfileProps) => {
  const dispatch = useAppDispatch();

  const currentProfile = useAppSelector(selectCurrentProfile);

  const profile = useAppSelector(state => selectProfileById(state, profileId));

  const slice = useAppSelector(selectPortalSlice);

  const handlePushClick = () => {
    const slice1: PortalSlice = {
      profileFilter: slice.profileFilter,
      originalQuery: '',
      query: '',
      entryIds: [entryId],
    };

    dispatch(pushPortalSlice(slice1));
  }

  if (!profile) return null;
  return (
    <IonCard style={{
      margin: 15,
      marginBottom: 0,
      borderTop: '7px solid',
      borderColor: profile.color,
      maxWidth: 420,
      padding: 10,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center'
      }}>
        <img 
          src={`https://www.gravatar.com/avatar/${md5(profile.email)}?d=retro`}
          style={{
            borderRadius: 30,
            border: `4px solid ${profile.color}`,
            width: 60,
            height: 60,
          }}
        />
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        fontSize: 20,
        marginBottom: 10,
      }}>
        { profile.name }
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <IonButtons>
          <IonButton onClick={() => {}} style={{
            marginRight: 5,
            display: profile.id === currentProfile?.id 
              ? 'none' 
              : null,
            color: ORANGE,
            borderRadius: 5,
            border: `1px solid ${ORANGE}`,
          }}>
            FOLLOW
          </IonButton>
          <IonButton style={{
            marginLeft: 5,
          }}>
            <IonIcon icon={shareOutline} size='small'/>
          </IonButton>
          <IonButton disabled={depth === 0 && slice.entryIds.length === 1} onClick={handlePushClick} style={{
            marginLeft: 5,
          }}>
            <IonIcon icon={easelOutline} size='small'/>
          </IonButton>
        </IonButtons>
        <IonButtons>
          <IonButton>
            <IonIcon icon={settingsOutline} size='small'/>
          </IonButton>
        </IonButtons>
      </div>
      <ProfileDirections entryId={entryId} profileId={profile.id} />
    </IonCard>
  );
}

export default Profile;