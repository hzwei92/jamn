import { IonButton, IonButtons, IonIcon } from "@ionic/react";
import { add, addOutline, arrowUpOutline } from "ionicons/icons";
import { useContext, useEffect } from "react";
import { v4 } from "uuid";
import { PostDirection } from "../../enums";
import useCreatePin from "../../hooks/pin/useCreatePin";
import useGetRootPins from "../../hooks/pin/useGetRootPins";
import { mergeEntries } from "../../redux/entrySlice";
import { selectPostById } from "../../redux/postSlice";
import { selectCurrentProfile } from "../../redux/profileSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Entry } from "../../types/entry";
import { Post } from "../../types/post";
import { AppContext } from "../app/AppProvider";
import EntryComponent from "./Entry";

interface EntryRootListProps {
  entry: Entry;
  post: Post;
  depth: number;
}

const EntryRootList = ({ entry, post, depth }: EntryRootListProps) => {
  const dispatch = useAppDispatch();

  const createPin = useCreatePin({
    onCompleted: (pin) => {
      const entry1: Entry = {
        id: v4(),
        postId: pin.rootPostId,
        profileId: pin.rootPost.profileId,
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
        rootEntryIds: [entry1.id, ...entry.rootEntryIds],
      };

      dispatch(mergeEntries([entry1, entry2]));
    },
  });

  const getRootPins = useGetRootPins({
    onCompleted: (pins) => {
      const entries: Entry[] = pins.map((pin) => {
        return {
          id: v4(),
          postId: pin.rootPostId,
          profileId: pin.rootPost.profileId,
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
        rootEntryIds: entries.map((entry) => entry.id),
      };

      dispatch(mergeEntries([entry1]));
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

  const { setShowCreatePostModal, setCreationPostId, setCreationDirection, connectionPostIds, setConnectionPostIds } = useContext(AppContext);
  
  const profile = useAppSelector(selectCurrentProfile);

  const connectionPost = useAppSelector(state => selectPostById(state, connectionPostIds[0] ?? null));

  const handleConnectClick = () => {
    if (!profile || !connectionPost || connectionPost.profileId !== profile?.id) return;
    createPin(connectionPost.id, post.id);
    setConnectionPostIds([]);
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
        <IonButton onClick={handleCreateClick} style={{
          display: connectionPostIds.length === 1 ? 'none' : null,
          borderRadius: 5,
          backgroundColor: '#f4900c',
          color: 'white',
        }}>
          <IonIcon icon={addOutline} />
        </IonButton>
        <IonButton onClick={handleConnectClick} disabled={!profile || connectionPost?.profileId !== profile.id} style={{
          display: connectionPostIds.length === 1 ? null : 'none',
          borderRadius: 5,
          backgroundColor: '#f4900c',
          color: 'white',
        }}>
          <IonIcon icon={arrowUpOutline} style={{
            transform: 'scale(.8)',
          }}/>
        </IonButton>
      </IonButtons>
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

export default EntryRootList;