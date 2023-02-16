import { gql, useMutation } from "@apollo/client";
import { FULL_POST_FIELDS } from "../../fragments/postFragments";
import { PostDirection } from "../../enums";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { setIsInit, setIsValid } from "../../redux/authSlice";
import { useIonToast } from "@ionic/react";
import { mergePosts } from "../../redux/postSlice";
import { mergeLinks } from "../../redux/linkSlice";
import { mergePins } from "../../redux/pinSlice";
import { LINK_FIELDS } from "../../fragments/linkFragments";
import { PIN_FIELDS } from "../../fragments/pinFragments";
import { Entry } from "../../types/entry";
import { v4 } from "uuid";
import { useContext } from "react";
import { AppContext } from "../../components/app/AppProvider";
import { mergeEntries, selectEntryById } from "../../redux/entrySlice";
import { PortalSlice } from "../../types/portal";
import { selectPortalSlice, splicePortalSlice } from "../../redux/portalSlice";
import { TAB_FIELDS } from "../../fragments/tabFragments";
import { mergeTabs } from "../../redux/tabSlice";

const CREATE_POST = gql`
  mutation CreatePost($text: String!, $contextPostId: String, $contextDirection: String) {
    createPost(text: $text, contextPostId: $contextPostId, contextDirection: $contextDirection) {
      post {
        ...FullPostFields
      }
      prevLink {
        ...LinkFields
        prevPost {
          ...FullPostFields
        }
        nextPost {
          ...FullPostFields
        }
      }
      nextLink {
        ...LinkFields
        prevPost {
          ...FullPostFields
        }
        nextPost {
          ...FullPostFields
        }
      }
      rootPin {
        ...PinFields
        rootPost {
          ...FullPostFields
        }
        leafPost {
          ...FullPostFields
        }
      }
      leafPin {
        ...PinFields
        rootPost {
          ...FullPostFields
        }
        leafPost {
          ...FullPostFields
        }
      }
      tab {
        ...TabFields
        post {
          ...FullPostFields
        }
      }
    }
  }
  ${FULL_POST_FIELDS}
  ${LINK_FIELDS}
  ${PIN_FIELDS}
  ${TAB_FIELDS}
`;

const useCreatePost = () => {
  const dispatch = useAppDispatch();

  const [present] = useIonToast();

  const { creationEntryId, setCreationEntryId, setCreationDirection } = useContext(AppContext);

  const creationEntry = useAppSelector(state => selectEntryById(state, creationEntryId));

  const slice = useAppSelector(selectPortalSlice);

  const [create] = useMutation(CREATE_POST, {
    onError: (err) => {
      present('Error creating post: ' + err.message, 4200);
      if (err.message === 'Unauthorized') {
        dispatch(setIsInit(false));
        dispatch(setIsValid(false));
      }
      else {
        console.error(err);
      }
    },
    onCompleted: (data) => {
      present('Post created', 4200);
      console.log(data);

      const { post, prevLink, nextLink, rootPin, leafPin, tab } = data.createPost;

      if (post) {
        dispatch(mergePosts([post]));
      }

      const links = [];
      if (prevLink) {
        links.push(prevLink);
      }
      if (nextLink) {
        links.push(nextLink);
      }

      dispatch(mergeLinks(links));

      const pins = [];
      if (rootPin) {
        pins.push(rootPin);
      }
      if (leafPin) {
        pins.push(leafPin);
      }

      dispatch(mergePins(pins));

      if (tab) {
        dispatch(mergeTabs([tab]));
      }

      const newPost = post ?? prevLink?.prevPost ?? nextLink?.nextPost ?? rootPin?.rootPost ?? leafPin?.leafPost ?? tab?.post;

      console.log(newPost);

      const entry: Entry = {
        id: v4(),
        parentEntryId: creationEntry?.id ?? null,
        childEntryIds: [],
        postId: newPost.id,
        profileId: newPost.profileId,
        linkId: prevLink?.id ?? nextLink?.id ?? null,
        pinId: rootPin?.id ?? leafPin?.id ?? null,
        tabId: tab?.id ?? null,
        showDirection: null,
        shouldFetch: false,
      };

      dispatch(mergeEntries([entry]));

      if (creationEntry) {
        const creationEntry1: Entry = {
          ...creationEntry,
          childEntryIds: prevLink || nextLink || rootPin || leafPin || tab
            ? [entry.id, ...creationEntry.childEntryIds]
            : creationEntry.childEntryIds,
        };

        dispatch(mergeEntries([creationEntry1]));
      }
      else {
        const slice1: PortalSlice = {
          ...slice,
          entryIds: [entry.id, ...slice.entryIds],
          shouldScrollToTop: !!post,
        };

        dispatch(splicePortalSlice(slice1));
      }

      setCreationEntryId(null);
      setCreationDirection(null);
    },
  });

  const createPost = (text: string, contextPostId: string | null, contextDirection: PostDirection | null) => {
    create({
      variables: {
        text,
        contextPostId,
        contextDirection,
      },
    });
  };

  return createPost;
};

export default useCreatePost;