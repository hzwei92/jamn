import { IonButton, IonButtons, IonCard, IonIcon } from "@ionic/react";
import { useContext } from "react";
import { selectPostById } from "../../redux/postSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { AppContext } from "../app/AppProvider";
import PostDirections from "./PostDirections";
import PostConnect from "./PostConnect";
import { linkOutline, pushOutline, settingsOutline } from "ionicons/icons";
import { pushPortalSlice, selectPortalSlice } from "../../redux/portalSlice";
import { PortalSlice } from "../../types/portal";
import md5 from 'md5';
import { getTimeString } from "../../utils";

interface PostProps {
  entryId: string;
  postId: string;
  depth: number;
}

const Post = ({ entryId, postId, depth }: PostProps) => {
  const dispatch = useAppDispatch();

  const { isDarkMode } = useContext(AppContext);

  const post = useAppSelector(state => selectPostById(state, postId));

  const slice = useAppSelector(selectPortalSlice);

  const handleFrameClick = () => {
    const slice1: PortalSlice = { 
      profileFilter: slice.profileFilter,
      originalQuery: '',
      query: '',
      entryIds: [entryId],
    };

    dispatch(pushPortalSlice(slice1));
  }

  if (!post) return null;

  const time = new Date(post.createDate).getTime();
  const timeString = getTimeString(time);

  return (
    <IonCard style={{
      margin: 15,
      marginBottom: 0,
      borderLeft: '5px solid',
      borderColor: post.profile?.color,
      maxWidth: 420,
      padding: 10,
    }}>
      <div>
        <div style={{
          marginTop: 5,
          marginLeft: 5,
          marginBottom: 10,
          display: 'flex',
        }}>
          <img 
              src={`https://www.gravatar.com/avatar/${md5(post.profile.email)}?d=retro`}
              style={{
                marginRight: 5,
                borderRadius: 10,
                border: `2px solid ${post.profile.color}`,
                width: 20,
                height: 20,
              }}
            />
            <div style={{
              display: 'inline-flex',
              justifyContent: 'center',
            }}>
              <div style={{
                textDecoration: 'underline',
              }}>
                { post.profile?.name }
              </div>
              &nbsp;
              { timeString }
            </div>
        </div>
        <div style={{
          marginLeft: 5,
          marginBottom: 20,
          color: isDarkMode
            ? 'white'
            : 'black',
        }}>
          {post.text}
        </div>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <div style={{
          display: 'flex',
        }}>
          <PostConnect postId={postId} />
          <IonButtons>
            <IonButton style={{
              marginLeft: 8,
            }}>
              <IonIcon icon={linkOutline} size='small'/>
            </IonButton>
            <IonButton disabled={depth === 0 && slice.entryIds.length === 1} onClick={handleFrameClick} style={{
              marginLeft: 5,
            }}>
              <IonIcon icon={pushOutline} size='small'/>
            </IonButton>
          </IonButtons>
        </div>

        <IonButtons>
          <IonButton>
            <IonIcon icon={settingsOutline} size='small'/>
          </IonButton>
        </IonButtons>
      </div>
      <PostDirections entryId={entryId} postId={postId} />
    </IonCard>
  );
}

export default Post;