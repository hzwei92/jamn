import { IonButton, IonButtons, IonIcon } from "@ionic/react";
import { arrowBackCircleOutline, arrowDownCircleOutline, arrowForwardCircleOutline, arrowUpCircleOutline } from "ionicons/icons";
import { useContext } from "react";
import { OFF_WHITE } from "../../constants";
import { PostDirection } from "../../enums";
import { mergeEntries, selectEntryById } from "../../redux/entrySlice";
import { selectPostById } from "../../redux/postSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Entry } from "../../types/entry";
import { AppContext } from "../app/AppProvider";

interface PostDirectionsProps {
  entryId: string;
  postId: string;
}
const PostDirections = ({ entryId, postId }: PostDirectionsProps) => {
  const dispatch = useAppDispatch();

  const { isDarkMode } = useContext(AppContext);

  const entry = useAppSelector(state => selectEntryById(state, entryId));

  const post = useAppSelector(state => selectPostById(state, postId));

  const handleDirectionClick = (showDirection: PostDirection) => () => {
    if (!entry) return;

    const entry1: Entry = {
      ...entry,
      showDirection: showDirection === entry.showDirection
        ? null
        : showDirection,
      shouldFetch: true,
    };

    dispatch(mergeEntries([entry1]));
  }

  if (!post) return null;

  return (
    <IonButtons style={{
      marginTop: 10,
      borderTop: '1px solid',
      paddingTop: 10,
      display: 'flex',
      justifyContent: 'space-between',
    }}>
      <IonButton onClick={handleDirectionClick(PostDirection.PREV)} style={{
        borderRadius: 5,
        border: entry?.showDirection === PostDirection.PREV
          ? '1px solid'
          : null,
        backgroundColor: entry?.showDirection === PostDirection.PREV
          ? isDarkMode
            ? 'black'
            : OFF_WHITE
          : null
      }}>
        <IonIcon icon={arrowBackCircleOutline} size='small'/>
        {post.prevCount}
      </IonButton>
      <IonButton onClick={handleDirectionClick(PostDirection.LEAF)} style={{
        borderRadius: 5,
        border: entry?.showDirection === PostDirection.LEAF
          ? '1px solid'
          : null,
        backgroundColor: entry?.showDirection === PostDirection.LEAF
          ? isDarkMode
            ? 'black'
            : OFF_WHITE
          : null
      }}>
        <IonIcon icon={arrowDownCircleOutline} size='small' />
        {post.leafCount}
      </IonButton>
      <IonButton onClick={handleDirectionClick(PostDirection.ROOT)} style={{
        borderRadius: 5,
        border: entry?.showDirection === PostDirection.ROOT
          ? '1px solid'
          : null,
        backgroundColor: entry?.showDirection === PostDirection.ROOT
          ? isDarkMode
            ? 'black'
            : OFF_WHITE
          : null
      }}>
        <IonIcon icon={arrowUpCircleOutline} size='small' />
        {post.rootCount}
      </IonButton>
      <IonButton onClick={handleDirectionClick(PostDirection.NEXT)} style={{
        borderRadius: 5,
        border: entry?.showDirection === PostDirection.NEXT
          ? '1px solid'
          : null,
        backgroundColor: entry?.showDirection === PostDirection.NEXT
          ? isDarkMode
            ? 'black'
            : OFF_WHITE
          : null
      }}>
        <IonIcon icon={arrowForwardCircleOutline} size='small' />
        {post.nextCount}
      </IonButton>
    </IonButtons>
  );
};

export default PostDirections;