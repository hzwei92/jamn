import { PostDirection } from "../../enums";
import { selectEntryById } from "../../redux/entrySlice";
import { selectPostById } from "../../redux/postSlice";
import { useAppSelector } from "../../redux/store";
import Post from "../post/Post";
import PostDirections from "../post/PostDirections";
import EntryLeafList from "./EntryLeafList";
import EntryNextList from "./EntryNextList";
import EntryPrevList from "./EntryPrevList";
import EntryRootList from "./EntryRootList";

interface EntryProps {
  entryId: string;
  depth: number;
}

const Entry = ({ entryId, depth }: EntryProps) => {
  const entry = useAppSelector(state => selectEntryById(state, entryId));
  const post = useAppSelector(state => selectPostById(state, entry?.postId ?? null));

  if (!entry || !post) return null;

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
            <EntryPrevList entry={entry} post={post} depth={depth} />
          )
        }
        {
          entry.showDirection === PostDirection.NEXT && (
            <EntryNextList entry={entry} post={post} depth={depth} />
          )
        }
        {
          entry.showDirection === PostDirection.ROOT && (
            <EntryRootList entry={entry} post={post} depth={depth} />
          )
        }
        {
          entry.showDirection === PostDirection.LEAF && (
            <EntryLeafList entry={entry} post={post} depth={depth} />
          )
        }
      </div>
    </div>
  )
}

export default Entry;