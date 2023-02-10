import { IonButton, IonButtons, IonIcon } from "@ionic/react";
import { add, arrowForwardOutline } from "ionicons/icons";
import { useContext, useEffect } from "react";
import { v4 } from "uuid";
import { PostDirection } from "../../enums";
import useCreateLink from "../../hooks/link/useCreateLink";
import useGetNextLinks from "../../hooks/link/useGetNextLinks";
import { mergeEntries } from "../../redux/entrySlice";
import { selectCurrentProfile } from "../../redux/profileSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Entry } from "../../types/entry";
import { Post } from "../../types/post";
import { AppContext } from "../app/AppProvider";
import EntryComponent from "./Entry";

interface EntryNextListProps {
  entry: Entry;
  post: Post;
  depth: number;
}

const EntryNextList = ({ entry, post, depth }: EntryNextListProps) => {
  const dispatch = useAppDispatch();

  const createLink = useCreateLink({
    onCompleted: (link) => {
      const entry1: Entry = {
        id: v4(),
        postId: link.nextPostId,
        profileId: link.nextPost.profileId,
        parentEntryId: entry.id,
        linkId: link.id,
        pinId: null,
        showDirection: null,
        prevEntryIds: [], 
        nextEntryIds: [],
        rootEntryIds: [],
        leafEntryIds: [],
        shouldFetch: false,
      };

      const entry2: Entry = {
        ...entry,
        nextEntryIds: [entry1.id, ...entry.nextEntryIds],
      };

      dispatch(mergeEntries([entry1, entry2]));
    },
  });

  const getNextLinks = useGetNextLinks({
    onCompleted: (links) => {
      const entries: Entry[] = links.map((link) => {
        return {
          id: v4(),
          postId: link.nextPostId,
          profileId: link.nextPost.profileId,
          parentEntryId: entry.id,
          linkId: link.id,
          pinId: null,
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
        nextEntryIds: entries.map((entry) => entry.id),
      };

      dispatch(mergeEntries([entry1]));
    },
  });

  useEffect(() => {
    if (!entry.shouldFetch) return;

    getNextLinks(entry.postId);

    const entry1: Entry = {
      ...entry,
      shouldFetch: false,
    }
    dispatch(mergeEntries([entry1]));
  }, [entry.shouldFetch]);


  const { setShowCreatePostModal, setCreationPostId, setCreationDirection, connectionPostIds, setConnectionPostIds } = useContext(AppContext);
  
  const profile = useAppSelector(selectCurrentProfile);

  const handleConnectClick = () => {
    if (!!profile && connectionPostIds.length === 1) {
      createLink(post.id, connectionPostIds[0]);
      setConnectionPostIds([]);
    }
  }

  const handleCreateClick = () => {
    setCreationPostId(post.id);
    setCreationDirection(PostDirection.NEXT);
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
          display: connectionPostIds.length > 0 ? 'none' : null,
          borderRadius: 5,
          backgroundColor: '#f4900c',
          color: 'white',
        }}>
          <IonIcon icon={add} />
        </IonButton>
        <IonButton disabled={connectionPostIds.length < 1} onClick={handleConnectClick} style={{
          display: connectionPostIds.length > 0 ? null : 'none',
          borderRadius: 5,
          backgroundColor: '#f4900c',
          color: 'white',
        }}>
          <IonIcon icon={arrowForwardOutline} style={{
            transform: 'scale(.8)',
          }}/>
        </IonButton>
      </IonButtons>
      {
        entry.nextEntryIds.map((entryId) => {
          return (
            <EntryComponent key={entryId} entryId={entryId} depth={depth + 1} />
          )
        })
      }
    </div>
  );
}

export default EntryNextList;