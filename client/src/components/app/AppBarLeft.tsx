import { IonButton, IonButtons, IonCard, IonIcon, isPlatform, useIonRouter } from "@ionic/react"
import { apertureOutline, mapOutline, moonOutline, notificationsOutline, peopleOutline, personCircleOutline, sunnyOutline } from "ionicons/icons";
import { useContext, useState } from "react";
import { v4 } from "uuid";
import { ProfileFilter } from "../../enums";
import useGetPosts from "../../hooks/post/useGetPosts";
import { mergeEntries } from "../../redux/entrySlice";
import { pushPortalSlice, selectPortalSlice, splicePortalSlice } from "../../redux/portalSlice";
import { selectCurrentProfile } from "../../redux/profileSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Entry } from "../../types/entry";
import { PortalSlice } from "../../types/portal";
import { AppContext } from "./AppProvider";
import icon from './favicon.png';

export enum Mode {
  NONE = 'NONE',
  PORTAL = 'PORTAL',
  MAP = 'MAP',
  ALERTS = 'ALERTS',
}


const AppBarLeft = () => {
  const dispatch = useAppDispatch();

  const router = useIonRouter();

  const path = router.routeInfo.pathname.split('/');

  const slice = useAppSelector(selectPortalSlice);

  const getPosts = useGetPosts({
    onCompleted: (posts) => {
      const entries = posts.map((post) => {
        const entry: Entry = {
          id: v4(),
          parentEntryId: null,
          childEntryIds: [],
          postId: post.id,
          profileId: post.profileId,
          linkId: null,
          pinId: null,
          tabId: null,
          showDirection: null,
          shouldFetch: false,
        };
        return entry;
      });

      dispatch(mergeEntries(entries));

      if (slice.dateRange?.startDate && slice.dateRange?.endDate) {
        const slice1: PortalSlice = {
          ...slice,
          dateRange: {
            ...slice.dateRange,
            endDate: posts.length === 0
              ? slice.dateRange.endDate
              : posts[0].createDate,
          },
          entryIds: [...entries.map((entry) => entry.id), ...slice.entryIds],
          shouldScrollToTop: true,
        };

        dispatch(splicePortalSlice(slice1));
      }
      else {
        const slice1: PortalSlice = {
          dateRange: {
            startDate: posts[posts.length - 1].createDate,
            endDate: posts[0].createDate,
          },
          profileFilter: ProfileFilter.ALL,
          originalQuery: '',
          query: '',
          entryIds: entries.map((entry) => entry.id),
          shouldScrollToTop: true,
        };

        dispatch(pushPortalSlice(slice1));
      }
    },
  });

  const { isDarkMode, setIsDarkMode } = useContext(AppContext);

  const [label, setLabel] = useState<Mode>(Mode.NONE);

  const handleMenuMouseEnter = (mode: Mode) => () => {
    setLabel(mode);
  }
  const handleMenuMouseLeave = () => {
    setLabel(Mode.NONE);
  }

  const handlePortalClick = () => {
    if (path[1] !== 'portal') {
      router.push('/portal');
    }
    getPosts(slice?.dateRange?.endDate ?? null, null);
  }

  const handleMapClick = () => {
    if (path[1] !== 'map') {
      router.push('/map');
    }
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
          onClick={handlePortalClick}
          style={{
            width: 50,
            height: 50,
          }}
        >
          <IonIcon icon={apertureOutline}/>
        </IonButton>
        <IonButton
          onMouseEnter={handleMenuMouseEnter(Mode.MAP)}
          onMouseLeave={handleMenuMouseLeave}
          onClick={handleMapClick}
          style={{
            width: 50,
            height: 50,
          }}
        >
          <IonIcon icon={mapOutline} />
        </IonButton>
        <IonButton
          onMouseEnter={handleMenuMouseEnter(Mode.ALERTS)}
          onMouseLeave={handleMenuMouseLeave}
          style={{
            height: 50,
            width: 50,
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
        display: label === Mode.MAP && !isPlatform('mobile')
          ? 'block'
          : 'none',
        position: 'absolute',
        left: 45,
        top: 100,
        padding: 5,
        border: `1px solid`,
      }}>
        MAP
      </IonCard>
      <IonCard style={{
        display: label === Mode.ALERTS && !isPlatform('mobile')
          ? 'block'
          : 'none',
        position: 'absolute',
        left: 45,
        top: 150,
        padding: 5,
        border: `1px solid`,
      }}>
        NOTIFICATIONS
      </IonCard>
    </IonCard>
  )
}

export default AppBarLeft;