import { IonButton, IonButtons, IonIcon } from "@ionic/react";
import { addOutline, arrowForwardOutline } from "ionicons/icons";
import { useContext, useEffect } from "react";
import { v4 } from "uuid";
import { PostDirection } from "../../enums";
import useCreateLink from "../../hooks/link/useCreateLink";
import useGetNextLinks from "../../hooks/link/useGetNextLinks";
import { mergeEntries, selectIdToEntry } from "../../redux/entrySlice";
import { selectCurrentProfile, selectProfileById } from "../../redux/profileSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Entry } from "../../types/entry";
import { Post } from "../../types/post";
import { AppContext } from "../app/AppProvider";
import EntryComponent from "../entry/Entry";

interface NextLinksProps {
  entry: Entry;
  post: Post;
  depth: number;
}

const NextLinks = ({ entry, post, depth }: NextLinksProps) => {
  const dispatch = useAppDispatch();

  const createLink = useCreateLink({
    onCompleted: (link) => {
      const entry1: Entry = {
        id: v4(),
        postId: link.nextPostId,
        profileId: null,
        linkId: link.id,
        pinId: null,
        tabId: null,
        showDirection: null,
        prevEntryIds: [],
        nextEntryIds: [],
        rootEntryIds: [],
        leafEntryIds: [],
        tabEntryIds: [],
        shouldFetch: false,
      };

      const entry2: Entry = {
        ...entry,
        nextEntryIds: [entry1.id, ...entry.nextEntryIds],
      };

      dispatch(mergeEntries([entry1, entry2]));
    },
  });

  const idToEntry = useAppSelector(selectIdToEntry);

  const getNextLinks = useGetNextLinks({
    onCompleted: (links) => {
      const entries: Entry[] = entry.nextEntryIds.map((id) => idToEntry[id]);

      links
        .filter((link) => !entries.some((entry) => entry.linkId === link.id))
        .forEach((link) => {
          entries.push({
            id: v4(),
            postId: link.nextPostId,
            profileId: null,
            linkId: link.id,
            pinId: null,
            tabId: null,
            showDirection: null,
            prevEntryIds: [],
            nextEntryIds: [],
            rootEntryIds: [],
            leafEntryIds: [],
            tabEntryIds: [],
            shouldFetch: false,
          })
        });

      const entry1: Entry = {
        ...entry,
        nextEntryIds: entries.map((entry) => entry.id),
      };

      entries.push(entry1);
      
      dispatch(mergeEntries(entries));
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


  const { setShowCreatePostModal, setCreationEntryId, setCreationDirection, connectionPostIds, setConnectionPostIds } = useContext(AppContext);
  
  const postProfile = useAppSelector(state => selectProfileById(state, post.profileId));

  const profile = useAppSelector(selectCurrentProfile);

  const handleConnectClick = () => {
    if (!!profile && connectionPostIds.length === 1) {
      createLink(post.id, connectionPostIds[0]);
      setConnectionPostIds([]);
    }
  }

  const handleCreateClick = () => {
    setCreationEntryId(entry.id);
    setCreationDirection(PostDirection.NEXT);
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
          display: connectionPostIds.length > 0 ? 'none' : null,
          borderRadius: 5,
          backgroundColor: '#f4900c',
          color: 'white',
        }}>
          <IonIcon icon={addOutline} />
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
      <div style={{
        marginLeft: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        color: 'grey',
      }}>
        (next posts)
      </div>
      </div>
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

export default NextLinks;