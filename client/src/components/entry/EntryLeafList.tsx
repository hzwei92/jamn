import { IonButton, IonButtons, IonIcon } from "@ionic/react";
import { add, addOutline, arrowDownCircleOutline, arrowDownOutline } from "ionicons/icons";
import { useContext, useEffect } from "react";
import { v4 } from "uuid";
import { PostDirection } from "../../enums";
import useCreatePin from "../../hooks/pin/useCreatePin";
import useGetLeafPins from "../../hooks/pin/useGetLeafPins";
import { mergeEntries } from "../../redux/entrySlice";
import { selectCurrentProfile } from "../../redux/profileSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Entry } from "../../types/entry";
import { Post } from "../../types/post";
import { AppContext } from "../app/AppProvider";
import EntryComponent from "./Entry";

interface EntryLeafListProps {
  entry: Entry;
  post: Post;
  depth: number;
}

const EntryLeafList = ({ entry, post, depth }: EntryLeafListProps) => {
  const dispatch = useAppDispatch();

  const createPin = useCreatePin({
    onCompleted: (pin) => {
      const entry1: Entry = {
        id: v4(),
        postId: pin.leafPostId,
        profileId: pin.leafPost.profileId,
        parentEntryId: entry.id,
        linkId: null,
        pinId: pin.id,
        showDirection: null,
        prevEntryIds: [],
        nextEntryIds: [],
        rootEntryIds: [],
        leafEntryIds: [],
        shouldFetch: false,
      }
      const entry2: Entry = {
        ...entry,
        leafEntryIds: [entry1.id, ...entry.leafEntryIds],
      };

      dispatch(mergeEntries([entry1, entry2]));
    },
  });

  const getLeafPins = useGetLeafPins({
    onCompleted: (pins) => {
      const entries: Entry[] = pins.map((pin) => {
        return {
          id: v4(),
          postId: pin.leafPostId,
          profileId: pin.leafPost.profileId,
          parentEntryId: entry.id,
          linkId: null,
          pinId: pin.id,
          showDirection: null,
          prevEntryIds: [],
          nextEntryIds: [],
          rootEntryIds: [],
          leafEntryIds: [],
          shouldFetch: false,
        };
      });

      dispatch(mergeEntries(entries));

      const entry1: Entry = {
        ...entry,
        leafEntryIds: entries.map((entry) => entry.id),
      };

      dispatch(mergeEntries([entry1]));
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

  const { setShowCreatePostModal, setCreationPostId, setCreationDirection, connectionPostIds, setConnectionPostIds } = useContext(AppContext);
  
  const profile = useAppSelector(selectCurrentProfile);
 
  const handleConnectClick = () => {
    if (!!profile && post.profileId === profile.id && connectionPostIds.length === 1) {
      createPin(post.id, connectionPostIds[0]);
      setConnectionPostIds([]);
    }
  }
   
  const handleCreateClick = () => {
    setCreationPostId(post.id);
    setCreationDirection(PostDirection.LEAF);
    setShowCreatePostModal(true);
  };


  return (
    <div style={{
      marginLeft: 15,
      borderLeft: '2px solid',
      borderColor: post.profile.color,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <IonButtons style={{
        marginLeft: 15,
        marginTop: 15,
      }}>
        <IonButton disabled={!profile || post.profileId !== profile.id} onClick={handleCreateClick} style={{
          display: connectionPostIds.length === 1 ? 'none' : null,
          borderRadius: 5,
          backgroundColor: '#f4900c',
          color: 'white',
        }}>
          <IonIcon icon={addOutline} />
        </IonButton>
        <IonButton disabled={!profile || post.profileId !== profile.id} onClick={handleConnectClick} style={{
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

export default EntryLeafList;