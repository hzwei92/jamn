import { gql, useMutation } from "@apollo/client";
import { FULL_POST_FIELDS } from "../../fragments/postFragments";
import { PostDirection } from "../../enums";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { setIsInit, setIsValid } from "../../redux/authSlice";
import { useIonToast } from "@ionic/react";
import { mergePosts } from "../../redux/postSlice";
import { mergeLinks } from "../../redux/linkSlice";
import { mergePins } from "../../redux/pinSlice";
import { Post } from "../../types/post";
import { Link } from "../../types/link";
import { Pin } from "../../types/pin";
import { LINK_FIELDS } from "../../fragments/linkFragments";
import { PIN_FIELDS } from "../../fragments/pinFragments";
import { Entry } from "../../types/entry";
import { v4 } from "uuid";
import { useContext } from "react";
import { AppContext } from "../../components/app/AppProvider";
import { mergeEntries, selectEntryById } from "../../redux/entrySlice";
import { PortalSlice } from "../../types/portal";
import { selectPortalSlice, splicePortalSlice } from "../../redux/portalSlice";

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
      }
      nextLink {
        ...LinkFields
        nextPost {
          ...FullPostFields
        }
      }
      rootPin {
        ...PinFields
        rootPost {
          ...FullPostFields
        }
      }
      leafPin {
        ...PinFields
        leafPost {
          ...FullPostFields
        }
      }
    }
  }
  ${FULL_POST_FIELDS}
  ${LINK_FIELDS}
  ${PIN_FIELDS}
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

      const { post, prevLink, nextLink, rootPin, leafPin } = data.createPost;

      dispatch(mergePosts([post]));

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

      const entry: Entry = {
        id: v4(),
        postId: post.id,
        profileId: post.profileId,
        linkId: prevLink?.id ?? nextLink?.id ?? null,
        pinId: rootPin?.id ?? leafPin?.id ?? null,
        parentEntryId: creationEntry?.id ?? null,
        showDirection: null,
        prevEntryIds: [],
        nextEntryIds: [],
        rootEntryIds: [],
        leafEntryIds: [],
        shouldFetch: false,
      };

      dispatch(mergeEntries([entry]));

      console.log(creationEntry);
      if (creationEntry) {
        const creationEntry1: Entry = {
          ...creationEntry,
          prevEntryIds: prevLink
            ? [entry.id, ...creationEntry.prevEntryIds]
            : creationEntry.prevEntryIds,
          nextEntryIds: nextLink
            ? [entry.id, ...creationEntry.nextEntryIds]
            : creationEntry.nextEntryIds,
          rootEntryIds: rootPin
            ? [entry.id, ...creationEntry.rootEntryIds]
            : creationEntry.rootEntryIds,
          leafEntryIds: leafPin
            ? [entry.id, ...creationEntry.leafEntryIds]
            : creationEntry.leafEntryIds,
        };

        dispatch(mergeEntries([creationEntry1]));
      }
      else {
        const slice1: PortalSlice = {
          ...slice,
          entryIds: [entry.id, ...slice.entryIds],
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