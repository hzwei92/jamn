import { IonButton, IonButtons, IonIcon } from "@ionic/react";
import { addOutline, arrowUpOutline } from "ionicons/icons";
import { useContext, useEffect } from "react";
import { v4 } from "uuid";
import { PostDirection } from "../../enums";
import useCreatePin from "../../hooks/pin/useCreatePin";
import useGetRootPins from "../../hooks/pin/useGetRootPins";
import { mergeEntries, selectIdToEntry } from "../../redux/entrySlice";
import { selectPostById } from "../../redux/postSlice";
import { selectCurrentProfile, selectProfileById } from "../../redux/profileSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Entry } from "../../types/entry";
import { Post } from "../../types/post";
import { AppContext } from "../app/AppProvider";
import EntryComponent from "../entry/Entry";

interface RootPinsProps {
  entry: Entry;
  post: Post;
  depth: number;
}

const RootPins = ({ entry, post, depth }: RootPinsProps) => {
  const dispatch = useAppDispatch();

  const createPin = useCreatePin({
    onCompleted: (pin) => {
      const entry1: Entry = {
        id: v4(),
        postId: pin.rootPostId,
        profileId: null,
        linkId: null,
        pinId: pin.id,
        tabId: null,
        showDirection: null,
        prevEntryIds: [],
        nextEntryIds: [],
        rootEntryIds: [],
        leafEntryIds: [],
        tabEntryIds: [],
        shouldFetch: false,
      }
      const entry2: Entry = {
        ...entry,
        rootEntryIds: [entry1.id, ...entry.rootEntryIds],
      };

      dispatch(mergeEntries([entry1, entry2]));
    },
  });

  const idToEntry = useAppSelector(selectIdToEntry);

  const getRootPins = useGetRootPins({
    onCompleted: (pins) => {
      const entries: Entry[] = entry.rootEntryIds.map((entryId) => idToEntry[entryId]);
      
      pins
        .filter(pin => !entries.some(entry => entry.pinId === pin.id))
        .map((pin) => {
          entries.push({
            id: v4(),
            postId: pin.rootPostId,
            profileId: null,
            linkId: null,
            pinId: pin.id,
            tabId: null,
            showDirection: null,
            prevEntryIds: [],
            nextEntryIds: [],
            rootEntryIds: [],
            leafEntryIds: [],
            tabEntryIds: [],
            shouldFetch: false,
          });
        });

      const entry1: Entry = {
        ...entry,
        rootEntryIds: entries.map((entry) => entry.id),
      };

      entries.push(entry1);

      dispatch(mergeEntries(entries));
    },
  });

  useEffect(() => {
    if (!entry.shouldFetch) return;

    getRootPins(entry.postId);

    const entry1: Entry = {
      ...entry,
      shouldFetch: false,
    }
    dispatch(mergeEntries([entry1]));
  }, [entry.shouldFetch]);

  const { setShowCreatePostModal, setCreationEntryId, setCreationDirection, connectionPostIds, setConnectionPostIds } = useContext(AppContext);
  
  const postProfile = useAppSelector(state => selectProfileById(state, post.profileId));

  const profile = useAppSelector(selectCurrentProfile);

  const connectionPost = useAppSelector(state => selectPostById(state, connectionPostIds[0] ?? null));

  const handleConnectClick = () => {
    if (!profile || !connectionPost || connectionPost.profileId !== profile?.id) return;
    createPin(connectionPost.id, post.id);
    setConnectionPostIds([]);
  }

  const handleCreateClick = () => {
    setCreationEntryId(entry.id);
    setCreationDirection(PostDirection.ROOT);
    setShowCreatePostModal(true);
  };

  return (
    <div style={{
      marginLeft: 15,
      borderLeft: '5px solid',
      borderColor: postProfile?.color,
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
        }}>
          <IonButton onClick={handleCreateClick} style={{
            marginRight: 10,
            display: connectionPostIds.length === 1 ? 'none' : null,
            borderRadius: 5,
            backgroundColor: '#f4900c',
            color: 'white',
          }}>
            <IonIcon icon={addOutline} />
          </IonButton>
          <IonButton disabled={connectionPost?.profileId !== profile?.id} onClick={handleConnectClick} style={{
            marginRight: 10,
            display: connectionPostIds.length === 1 
              ? null
              : 'none',
            borderRadius: 5,
            backgroundColor: '#f4900c',
            color: 'white',
          }}>
            <IonIcon icon={arrowUpOutline} style={{
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
          (super posts)
        </div>
      </div>
      {
        entry.rootEntryIds.map((entryId) => {
          return (
            <EntryComponent key={entryId} entryId={entryId} depth={depth + 1} />
          )
        })
      }
    </div>
  );
}

export default RootPins;