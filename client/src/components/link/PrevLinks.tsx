import { IonButton, IonButtons, IonIcon } from "@ionic/react";
import { add, addOutline, arrowBackOutline } from "ionicons/icons";
import { useContext, useEffect } from "react";
import { v4 } from "uuid";
import { PostDirection } from "../../enums";
import useCreateLink from "../../hooks/link/useCreateLink";
import useGetPrevLinks from "../../hooks/link/useGetPrevLinks";
import { mergeEntries, selectIdToEntry } from "../../redux/entrySlice";
import { selectCurrentProfile, selectProfileById } from "../../redux/profileSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Entry } from "../../types/entry";
import { Post } from "../../types/post";
import { AppContext } from "../app/AppProvider";
import EntryComponent from "../entry/Entry";

interface PrevLinksProps {
  entry: Entry;
  post: Post;
  depth: number;
}

const PrevLinks = ({ entry, post, depth }: PrevLinksProps) => {
  const dispatch = useAppDispatch();

  const createLink = useCreateLink({
    onCompleted: (link) => {

      const entry1: Entry = {
        id: v4(),
        postId: link.prevPostId,
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
        prevEntryIds: [entry1.id, ...entry.prevEntryIds],
      };

      dispatch(mergeEntries([entry1, entry2]));
    },
  });

  const idToEntry = useAppSelector(selectIdToEntry);

  const getPrevLinks = useGetPrevLinks({
    onCompleted: (links) => {
      const entries: Entry[] = entry.prevEntryIds.map((id) => idToEntry[id]);
      
      links
        .filter((link) => !entries.some((entry) => entry.linkId === link.id))
        .forEach((link) => {
          entries.push({
            id: v4(),
            postId: link.prevPostId,
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
          });
        });

      const entry1: Entry = {
        ...entry,
        prevEntryIds: entries.map((entry) => entry.id),
      };

      entries.push(entry1);

      dispatch(mergeEntries(entries));
    },
  });

  useEffect(() => {
    if (!entry.shouldFetch) return;

    getPrevLinks(entry.postId);

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
    if (!!profile && connectionPostIds.length  === 1) {
      createLink(connectionPostIds[0], post.id);
      setConnectionPostIds([]);
    }
  }

  const handleCreateClick = () => {
    setCreationEntryId(entry.id);
    setCreationDirection(PostDirection.PREV);
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
            <IonIcon icon={arrowBackOutline} style={{
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
          (prev posts)
        </div>
      </div>
      {
        entry.prevEntryIds.map((entryId) => {
          return (
            <EntryComponent key={entryId} entryId={entryId} depth={depth + 1} />
          )
        })
      }
    </div>
  );
}

export default PrevLinks;