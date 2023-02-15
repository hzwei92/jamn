import { useEffect, useRef } from "react";
import { IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonPage } from "@ionic/react";
import useGetPosts from "../../hooks/post/useGetPosts";
import CreatePostFab from "./CreatePostFab";
import { Entry } from "../../types/entry";
import { v4 } from "uuid";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { mergeEntries } from "../../redux/entrySlice";
import { PortalSlice } from "../../types/portal";
import { ProfileFilter } from "../../enums";
import { pushPortalSlice, selectPortalSlice, splicePortalSlice } from "../../redux/portalSlice";
import EntryComponent from "../entry/Entry";
import { selectIsDone } from "../../redux/authSlice";

const Portal = () => {
  const dispatch = useAppDispatch();

  const contentRef = useRef<HTMLIonContentElement>(null);

  const slice = useAppSelector(selectPortalSlice);

  const getPosts = useGetPosts({
    onCompleted: (posts) => {
      if (posts.length === 0) return;

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

      if (slice?.dateRange?.startDate && slice?.dateRange?.endDate) {
        const slice1: PortalSlice = {
          ...slice,
          dateRange: {
            startDate: posts[posts.length - 1].createDate,
            endDate: slice.dateRange.endDate,
          },
          entryIds: [...slice.entryIds, ...entries.map((entry) => entry.id)],
        };

        dispatch(splicePortalSlice(slice1));
      }
      else {
        const slice1: PortalSlice = {
          dateRange: {
            startDate: posts[posts.length - 1].createDate,
            endDate: posts[0].createDate,
          },
          profileFilter: ProfileFilter.ALL,
          originalQuery: '',
          query: '',
          entryIds: entries.map((entry) => entry.id),
          shouldScrollToTop: false,
        };
  
        dispatch(pushPortalSlice(slice1));
      }
    }
  });

  const isDone = useAppSelector(selectIsDone);
  
  useEffect(() => {
    if (!isDone) return;
    getPosts(null, null);
  }, [isDone]);


  useEffect(() => {
    if (!slice?.shouldScrollToTop) return;
    contentRef.current?.scrollToTop(500);

    const slice1 = {
      ...slice,
      shouldScrollToTop: false,
    };
    dispatch(splicePortalSlice(slice1));
  }, [slice?.shouldScrollToTop]);

  return (
    <IonPage>
      <IonContent ref={contentRef} color={"tertiary"} style={{
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
            height: 20,
          }}/>
          <IonInfiniteScroll onIonInfinite={
            (e) => {
              if (slice?.dateRange?.startDate && slice?.dateRange?.endDate) {
                getPosts(null, slice.dateRange.startDate);
                setTimeout(() => {
                  e.target.complete();
                }, 500);
              }
              else {
                e.target.complete();
              }
    
            }
          }>
            <IonInfiniteScrollContent loadingSpinner={'dots'} style={{
              width: 440,
            }}/>
          </IonInfiniteScroll>

      </IonContent>
    </IonPage>
  );
}

export default Portal;