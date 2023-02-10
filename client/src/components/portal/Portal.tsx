import { AppContext } from "../app/AppProvider";
import { useContext, useEffect } from "react";
import { IonContent, IonPage } from "@ionic/react";
import useGetPosts from "../../hooks/post/useGetPosts";
import CreatePostFab from "./CreatePostFab";
import { Entry } from "../../types/entry";
import { v4 } from "uuid";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { mergeEntries } from "../../redux/entrySlice";
import { PortalSlice } from "../../types/portal";
import { ProfileFilter } from "../../enums";
import { pushPortalSlice, selectPortalSlice } from "../../redux/portalSlice";
import EntryComponent from "../entry/Entry";

const Portal = () => {
  const dispatch = useAppDispatch();

  const getPosts = useGetPosts({
    onCompleted: (posts) => {
      const entries: Entry[] = posts.map((post) => {
        return {
          id: v4(),
          postId: post.id,
          profileId: post.profileId,
          parentEntryId: null,
          linkId: null,
          pinId: null,
          showDirection: null,
          prevEntryIds: [],
          nextEntryIds: [],
          rootEntryIds: [],
          leafEntryIds: [],
          shouldFetch: false,
        }
      });

      dispatch(mergeEntries(entries));

      const slice: PortalSlice = {
        profileFilter: ProfileFilter.ALL,
        originalQuery: '',
        query: '',
        entryIds: entries.map((entry) => entry.id),
      };

      dispatch(pushPortalSlice(slice));
    }
  });

  useEffect(() => {
    getPosts();
  }, []);

  const { connectionPostIds, isDarkMode } = useContext(AppContext);

  const slice = useAppSelector(selectPortalSlice);

  return (
    <IonPage>
      <IonContent color={"tertiary"} style={{
        position: 'relative',
        alignItems: 'center',
      }}>
        <CreatePostFab />
          {
            (slice?.entryIds || []).map((entryId) => {
              return (
                <EntryComponent
                  key={entryId}
                  entryId={entryId}
                  depth={0}
                />
              )
            })
          }
          <div style={{
            height: 100,
          }}/>
      </IonContent>
    </IonPage>
  );
}

export default Portal;