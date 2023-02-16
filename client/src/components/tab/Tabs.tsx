import { IonButton, IonButtons, IonIcon } from "@ionic/react";
import { addOutline, arrowBackOutline } from "ionicons/icons";
import { useContext, useEffect } from "react";
import { v4 } from "uuid";
import { PostDirection } from "../../enums";
import useCreateTab from "../../hooks/tab/useCreateTab";
import useGetTabs from "../../hooks/tab/useGetTabs";
import { mergeEntries } from "../../redux/entrySlice";
import { selectCurrentProfile } from "../../redux/profileSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Entry } from "../../types/entry";
import { Profile } from "../../types/profile";
import { AppContext } from "../app/AppProvider";
import EntryComponent from "../entry/Entry";

interface TabsProps {
  entry: Entry;
  profile: Profile;
  depth: number;
}

const Tabs = ({ entry, profile, depth }: TabsProps) => {
  const dispatch = useAppDispatch();

  const createTab = useCreateTab({
    onCompleted: (tab) => {
      const entry1: Entry = {
        id: v4(),
        parentEntryId: entry.id,
        childEntryIds: [],
        postId: tab.post.id,
        profileId: tab.post.profileId,
        linkId: null,
        pinId: null,
        tabId: tab.id,
        showDirection: null,
        shouldFetch: false,
      };

      const entry2: Entry = {
        ...entry,
        childEntryIds: [entry1.id, ...entry.childEntryIds],
      };

      dispatch(mergeEntries([entry1, entry2]));
    }
  })

  const getTabs = useGetTabs({
    onCompleted: (tabs) => {
      const entries: Entry[] = tabs.map((tab) => {
        return {
          id: v4(),
          parentEntryId: entry.id,
          childEntryIds: [],
          postId: tab.post.id,
          profileId: tab.post.profileId,
          linkId: null,
          pinId: null,
          tabId: tab.id,
          showDirection: null,
          shouldFetch: false,
        }
      });

      const entry1: Entry = {
        ...entry,
        childEntryIds: entries.map((entry) => entry.id),
      }

      entries.push(entry1);

      dispatch(mergeEntries(entries));
    },
  });

  const { 
    setShowCreatePostModal,
    setCreationEntryId,
    setCreationDirection,
    connectionPostIds,
    setConnectionPostIds,
  } = useContext(AppContext);

  useEffect(() => {
    if (!entry.shouldFetch) return;

    getTabs(entry.profileId);

    const entry1: Entry = {
      ...entry,
      shouldFetch: false,
    }
    dispatch(mergeEntries([entry1]));
  }, [entry.shouldFetch]);

  const currentProfile = useAppSelector(selectCurrentProfile);

  const handleConnectClick = () => {
    if (!!profile && connectionPostIds.length === 1) {
      createTab(connectionPostIds[0]);
      setConnectionPostIds([]);
    }
  }

  const handleCreateClick = () => {
    setCreationEntryId(entry.id);
    setCreationDirection(PostDirection.TAB);
    setShowCreatePostModal(true);
  };

  return (
    <div style={{
      marginLeft: 15,
      borderLeft: '2px solid',
      borderColor: profile.color,
      display: 'flex',
      flexDirection: 'column',
      borderBottomLeftRadius: 5,
    }}>
      <div style={{
        marginLeft: 15,
        marginTop: 15,
        display: 'flex',
      }}>
      <IonButtons style={{
        marginRight: 10,
      }}>
        <IonButton disabled={profile.id !== currentProfile?.id} onClick={handleCreateClick} style={{
          display: connectionPostIds.length > 0 ? 'none' : null,
          borderRadius: 5,
          backgroundColor: '#f4900c',
          color: 'white',
        }}>
          <IonIcon icon={addOutline} />
        </IonButton>
        <IonButton disabled={profile.id !== currentProfile?.id} onClick={handleConnectClick} style={{
          display:  connectionPostIds.length > 0 ? null : 'none',
          borderRadius: 5,
          backgroundColor: '#f4900c',
          color: 'white',
        }}>
          <IonIcon icon={arrowBackOutline} style={{
            transform: 'scale(.8)',
          }}/>
        </IonButton>
      </IonButtons>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        color: 'grey',
      }}>
        (index)
      </div>
      </div>
      {
        entry.childEntryIds.map((entryId) => {
          return (
            <EntryComponent key={entryId} entryId={entryId} depth={depth + 1} />
          )
        })
      }
    </div>
  )
}

export default Tabs;