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
import Tabs from "../tab/Tabs";
import Activity from "../activity/Activity";
import { selectTabById } from "../../redux/tabSlice";

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
  const tab = useAppSelector(state => selectTabById(state, entry?.tabId ?? null));

  if (!entry || link?.deleteDate || pin?.deleteDate || tab?.deleteDate) return null;

  if (!post) {
    if (!profile) return null;
    
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
            entry.showDirection === PostDirection.TAB && (
              <Tabs entry={entry} profile={profile} depth={depth} />
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