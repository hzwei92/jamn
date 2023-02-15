import { useEffect } from "react";
import { v4 } from "uuid";
import useGetPost from "../../hooks/post/useGetPost";
import { mergeEntries } from "../../redux/entrySlice";
import { useAppDispatch } from "../../redux/store";
import { Entry } from "../../types/entry";
import { Profile } from "../../types/profile";
import EntryComponent from "../entry/Entry";

interface IndexProps {
  entry: Entry;
  profile: Profile;
  depth: number;
}

const Index = ({ entry, profile, depth }: IndexProps) => {
  const dispatch = useAppDispatch();

  const getPost = useGetPost({
    onCompleted: (post) => {
      const entries: Entry[] = [{
        id: v4(),
        postId: post.id,
        profileId: post.profileId,
        parentEntryId: entry.id,
        linkId: null,
        pinId: null,
        showDirection: null,
        prevEntryIds: [],
        nextEntryIds: [],
        rootEntryIds: [],
        leafEntryIds: [],
        shouldFetch: false,
      }];

      const entry1: Entry = {
        ...entry,
        prevEntryIds: entries.map((entry) => entry.id),
      };

      entries.push(entry1);

      dispatch(mergeEntries(entries));
    },
  });

  useEffect(() => {
    if (!entry?.shouldFetch || !profile.indexPostId) return;
    getPost(profile.indexPostId);
  }, [entry?.shouldFetch])


  return (
    <div style={{
      marginLeft: 15,
      borderLeft: '2px solid',
      borderColor: profile.color,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        marginTop: 15,
        marginLeft: 15,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        color: 'grey',
      }}>
        (index)
      </div>
      {
        entry.prevEntryIds.map((entryId) => {
          return (
            <EntryComponent key={entryId} entryId={entryId} depth={depth + 1} />
          )
        })
      }
    </div>
  )
}

export default Index;