import { IonButton, IonButtons, IonCard, IonIcon } from "@ionic/react";
import { returnUpBackOutline, settingsOutline, shareOutline } from "ionicons/icons";
import md5 from "md5";
import { ORANGE } from "../../constants";
import { selectEntryById } from "../../redux/entrySlice";
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

  const entry = useAppSelector(state => selectEntryById(state, entryId));

  const profile = useAppSelector(state => selectProfileById(state, profileId));

  const slice = useAppSelector(selectPortalSlice);

  const handlePushClick = () => {
    const slice1: PortalSlice = {
      dateRange: {
        startDate: null,
        endDate: null,
      },
      profileFilter: slice.profileFilter,
      originalQuery: '',
      query: '',
      entryIds: [entryId],
      shouldScrollToTop: true,
    };

    dispatch(pushPortalSlice(slice1));
  }

  if (!profile) return null;
  return (
    <IonCard style={{
      margin: 15,
      marginBottom: 0,
      borderTop: `7px solid ${profile.color}`,
      borderLeft: !!entry?.showDirection
        ? `2px solid ${profile.color}`
        : 'none',
      maxWidth: 420,
      padding: 10,
      borderBottomLeftRadius: !!entry?.showDirection
        ? 0
        : 5,
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
            <IonIcon icon={returnUpBackOutline} size='small'/>
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