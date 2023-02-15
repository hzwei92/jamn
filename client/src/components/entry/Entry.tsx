import { PostDirection } from "../../enums";
import { selectEntryById } from "../../redux/entrySlice";
import { selectLinkById } from "../../redux/linkSlice";
import { selectPinById } from "../../redux/pinSlice";
import { selectPostById } from "../../redux/postSlice";
import { selectProfileById } from "../../redux/profileSlice";
import { useAppSelector } from "../../redux/store";
import Post from "../post/Post";
import Profile from "../profile/Profile";
import LeafPins from "../pin/LeafPins";
import NextLinks from "../link/NextLinks";
import PrevLinks from "../link/PrevLinks";
import RootPins from "../pin/RootPins";
import Leaders from "../lead/Leaders";
import Followers from "../lead/Followers";
import IndexPost from "../indexPost/IndexPost";
import Activity from "../activity/Activity";

interface EntryProps {
  entryId: string;
  depth: number;
}

const Entry = ({ entryId, depth }: EntryProps) => {
  const entry = useAppSelector(state => selectEntryById(state, entryId));

  const profile = useAppSelector(state => selectProfileById(state, entry?.profileId ?? null));
  const post = useAppSelector(state => selectPostById(state, entry?.postId ?? null));

  const link = useAppSelector(state => selectLinkById(state, entry?.linkId ?? null));
  const pin = useAppSelector(state => selectPinById(state, entry?.pinId ?? null));

  if (!entry || !profile || link?.deleteDate || pin?.deleteDate) return null;

  if (!post) {
    return (
      <div>
        <Profile entryId={entryId} profileId={profile.id} depth={depth} />
        <div style={{
          height: entry.showDirection
            ? 'auto'
            : 0,
          transition: 'height 5s'
        }}>
          {
            entry.showDirection === PostDirection.PREV && (
              <IndexPost entry={entry} profile={profile} depth={depth} />
            )
          }
          {
            entry.showDirection === PostDirection.NEXT && (
              <Activity entry={entry} profile={profile} depth={depth} />
            )
          }
          {
            entry.showDirection === PostDirection.ROOT && (
              <Followers entry={entry} profile={profile} depth={depth} />
            )
          }
          {
            entry.showDirection === PostDirection.LEAF && (
              <Leaders entry={entry} profile={profile} depth={depth} />
            )
          }
        </div>
      </div>
    );
  }

  return (
    <div>
      <Post entryId={entryId} postId={post.id} depth={depth} />
      <div style={{
        height: entry.showDirection
          ? 'auto'
          : 0,
        transition: 'height 5s'
      }}>
        {
          entry.showDirection === PostDirection.PREV && (
            <PrevLinks entry={entry} post={post} depth={depth} />
          )
        }
        {
          entry.showDirection === PostDirection.NEXT && (
            <NextLinks entry={entry} post={post} depth={depth} />
          )
        }
        {
          entry.showDirection === PostDirection.ROOT && (
            <RootPins entry={entry} post={post} depth={depth} />
          )
        }
        {
          entry.showDirection === PostDirection.LEAF && (
            <LeafPins entry={entry} post={post} depth={depth} />
          )
        }
      </div>
    </div>
  )
}

export default Entry;