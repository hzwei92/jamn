import { IonButton, IonButtons, IonIcon } from "@ionic/react";
import { add, addOutline, arrowDownCircleOutline, arrowDownOutline } from "ionicons/icons";
import { useContext, useEffect } from "react";
import { v4 } from "uuid";
import { PostDirection } from "../../enums";
import useCreatePin from "../../hooks/pin/useCreatePin";
import useGetLeafPins from "../../hooks/pin/useGetLeafPins";
import { mergeEntries, selectIdToEntry } from "../../redux/entrySlice";
import { selectCurrentProfile, selectProfileById } from "../../redux/profileSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Entry } from "../../types/entry";
import { Post } from "../../types/post";
import { AppContext } from "../app/AppProvider";
import EntryComponent from "../entry/Entry";

interface LeafPinsProps {
  entry: Entry;
  post: Post;
  depth: number;
}

const LeafPins = ({ entry, post, depth }: LeafPinsProps) => {
  const dispatch = useAppDispatch();

  const createPin = useCreatePin({
    onCompleted: (pin) => {
      const entry1: Entry = {
        id: v4(),
        postId: pin.leafPostId,
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
        leafEntryIds: [entry1.id, ...entry.leafEntryIds],
      };

      dispatch(mergeEntries([entry1, entry2]));
    },
  });

  const idToEntry = useAppSelector(selectIdToEntry);

  const getLeafPins = useGetLeafPins({
    onCompleted: (pins) => {
      const entries: Entry[] = entry.leafEntryIds.map((entryId) => idToEntry[entryId]);
      
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
        leafEntryIds: entries.map((entry) => entry.id),
      };

      entries.push(entry1);

      dispatch(mergeEntries(entries));
    },
  });

  useEffect(() => {
    if (!entry.shouldFetch) return;

    getLeafPins(entry.postId);

    const entry1: Entry = {
      ...entry,
      shouldFetch: false,
    }
    dispatch(mergeEntries([entry1]));
  }, [entry.shouldFetch]);

  const { setShowCreatePostModal, setCreationEntryId, setCreationDirection, connectionPostIds, setConnectionPostIds } = useContext(AppContext);
  
  const postProfile = useAppSelector(state => selectProfileById(state, post.profileId));

  const profile = useAppSelector(selectCurrentProfile);
 
  const handleConnectClick = () => {
    if (!!profile && post.profileId === profile.id && connectionPostIds.length === 1) {
      createPin(post.id, connectionPostIds[0]);
      setConnectionPostIds([]);
    }
  }
   
  const handleCreateClick = () => {
    setCreationEntryId(entry.id);
    setCreationDirection(PostDirection.LEAF);
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
          marginRight: 10,
        }}>
          <IonButton disabled={post.profileId !== profile?.id} onClick={handleCreateClick} style={{
            display: connectionPostIds.length === 1 ? 'none' : null,
            borderRadius: 5,
            backgroundColor: '#f4900c',
            color: 'white',
          }}>
            <IonIcon icon={addOutline} />
          </IonButton>
          <IonButton disabled={post.profileId !== profile?.id} onClick={handleConnectClick} style={{
            display: connectionPostIds.length === 1 ? null : 'none',
            borderRadius: 5,
            backgroundColor: '#f4900c',
            color: 'white',
          }}>
            <IonIcon icon={arrowDownOutline} style={{
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
          (sub posts)
        </div>
      </div>
      {
        entry.leafEntryIds.map((entryId) => {
          return (
            <EntryComponent key={entryId} entryId={entryId} depth={depth + 1} />
          )
        })
      }
    </div>
  );
}

export default LeafPins;