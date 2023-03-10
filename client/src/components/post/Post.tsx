import { IonButton, IonButtons, IonCard, IonIcon, IonPopover, isPlatform } from "@ionic/react";
import { useContext, useState } from "react";
import { selectPostById } from "../../redux/postSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { AppContext } from "../app/AppProvider";
import PostDirections from "./PostDirections";
import PostConnect from "./PostConnect";
import { caretDownOutline, caretUpOutline, chevronDownOutline, chevronUpOutline, closeOutline, returnUpBackOutline, settingsOutline, shareOutline } from "ionicons/icons";
import { pushPortalSlice, selectPortalSlice } from "../../redux/portalSlice";
import { PortalSlice } from "../../types/portal";
import md5 from 'md5';
import { deserialize, getTimeString } from "../../utils";
import { selectCurrentProfile, selectProfileById } from "../../redux/profileSlice";
import { mergeEntries, selectEntryById } from "../../redux/entrySlice";
import { selectPinById } from "../../redux/pinSlice";
import useDeletePin from "../../hooks/pin/useDeletePin";
import { Editable, Slate, withReact } from "slate-react";
import { createEditor } from "slate";
import { Entry } from "../../types/entry";
import { v4 } from "uuid";
import useVote from "../../hooks/vote/useVote";
import useDeleteTab from "../../hooks/tab/useDeleteTab";
import { selectTabById } from "../../redux/tabSlice";

interface PostProps {
  entryId: string;
  postId: string;
  depth: number;
}

const Post = ({ entryId, postId, depth }: PostProps) => {
  const dispatch = useAppDispatch();

  const vote = useVote();
  
  const deletePin = useDeletePin();
  const deleteTab = useDeleteTab();

  const { isDarkMode } = useContext(AppContext);

  const entry = useAppSelector(state => selectEntryById(state, entryId));
  const post = useAppSelector(state => selectPostById(state, postId));

  const pin = useAppSelector(state => selectPinById(state, entry?.pinId ?? null));
  const pinRootPost = useAppSelector(state => selectPostById(state, pin?.rootPostId ?? null));

  const tab = useAppSelector(state => selectTabById(state, entry?.tabId ?? null));

  const slice = useAppSelector(selectPortalSlice);

  const postProfile = useAppSelector(state => selectProfileById(state, post?.profileId ?? null));

  const profile = useAppSelector(selectCurrentProfile);

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

  const handleProfileClick = () => {
    if (!post) return;
    const entry1: Entry = {
      id: v4(),
      postId: null,
      profileId: post?.profileId,
      linkId: null,
      pinId: null,
      tabId: null,
      showDirection: null,
      prevEntryIds: [],
      nextEntryIds: [],
      rootEntryIds: [],
      leafEntryIds: [],
      tabEntryIds: [],
      shouldFetch: false,
    }

    dispatch(mergeEntries([entry1]));

    const slice1: PortalSlice = {
      dateRange: {
        startDate: null,
        endDate: null,
      },
      profileFilter: slice.profileFilter,
      originalQuery: '',
      query: '',
      entryIds: [entry1.id],
      shouldScrollToTop: true,
    };

    dispatch(pushPortalSlice(slice1));
  }

  const handleDeleteClick = () => {
    if (pin) {
      deletePin(pin.id)
    }
    else if (entry?.tabId) {
      deleteTab(entry.tabId);
    }
  }

  const handleUpvoteClick = () => {
    if (!post || !profile) return;
    
    if (post.currentProfileVote?.value === 1) {
      vote(post.id, 0);
    }
    else {
      vote(post.id, 1);
    }
  }

  const handleDownvoteClick = () => {
    if (!post || !profile) return;
    
    if (post.currentProfileVote?.value === -1) {
      vote(post.id, 0);
    }
    else {
      vote(post.id, -1);
    }
  }

  const [editor] = useState(() => withReact(createEditor()));

  const value = deserialize(post?.text ?? '');

  if (!post || !postProfile) return null;

  const time = new Date(post.createDate).getTime();
  const timeString = getTimeString(time);

  return (
    <IonCard style={{
      margin: 15,
      marginBottom: 0,
      borderLeft: '5px solid',
      borderColor: postProfile.color,
      maxWidth: 420,
      padding: 10,
      borderBottomLeftRadius: !!entry?.showDirection
        ? 0
        : null,
    }}>
      <div style={{
        position: 'relative',
        marginLeft: 24,
      }}>
      <div style={{
        position: 'absolute',
        left: isPlatform('ios')
          ? -31
          : -33,
        top: -10,
      }}>
        <IonButtons style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          <IonButton disabled={!profile} onClick={handleUpvoteClick} style={{
            color: post.currentProfileVote?.value === 1
              ? profile?.color
              : null,
          }}>
            <IonIcon icon={post.currentProfileVote?.value === 1 ? caretUpOutline : chevronUpOutline} size='small'/>
          </IonButton>
          <IonButton>
            { post.upvotes }
          </IonButton>
          <IonButton disabled={!profile} onClick={handleDownvoteClick} style={{
            color: post.currentProfileVote?.value === -1
              ? profile?.color
              : null,
          }}>
            <IonIcon icon={post.currentProfileVote?.value === -1 ? caretDownOutline : chevronDownOutline} size='small'/>
          </IonButton>
        </IonButtons>
      </div>
      <div>
        <div style={{
          marginTop: 5,
          marginLeft: 5,
          marginBottom: 10,
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <div style={{
            display: 'flex',
          }}>
            <img 
              src={`https://www.gravatar.com/avatar/${md5(postProfile.email)}?d=retro`}
              style={{
                marginRight: 5,
                borderRadius: 10,
                border: `2px solid ${postProfile.color}`,
                width: 20,
                height: 20,
              }}
            />
            <div style={{
              display: 'inline-flex',
            }}>
              <div onClick={handleProfileClick} style={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}>
                { postProfile?.name }
              </div>
              &nbsp;
              { timeString }
            </div>  
          </div>
        </div>
        <div style={{
          marginLeft: 5,
          marginBottom: 15,
          color: isDarkMode
            ? 'white'
            : 'black',
        }}>
          <Slate editor={editor} value={value} >
            <Editable readOnly={true}/>
          </Slate>
        </div>
      </div>
      <div style={{
        marginLeft: 4,
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <div style={{
          display: 'flex',
        }}>
          <PostConnect postId={postId} />
          <IonButtons style={{
            marginLeft: !!profile
              ? 0
              : -5,
          }}>
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
            <IonButton onClick={handleDeleteClick} style={{
                display: 
                  !!profile && (
                    (!!pin && profile.id === pinRootPost?.profileId) || 
                    (!!tab && profile.id === tab.profileId)
                  ) && depth !== 0
                    ? null
                    : 'none',
                marginLeft: 5,
              }}>
                <IonIcon icon={closeOutline} size='small'/>
              </IonButton>
          </IonButtons>
        </div>

        <IonButtons>
          <IonButton id={'settingsButton-' + entryId}>
            <IonIcon icon={settingsOutline} size='small'/>
          </IonButton>
          <IonPopover trigger={'settingsButton-' + entryId} triggerAction='click'>
            <div style={{
              padding: 10,
            }}>
            </div>
          </IonPopover>
        </IonButtons>
      </div>
      </div>
      <PostDirections entryId={entryId} postId={postId} />
    </IonCard>
  );
}

export default Post;