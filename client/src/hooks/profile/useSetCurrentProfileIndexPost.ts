import { gql, useMutation } from "@apollo/client";
import { PROFILE_FIELDS } from "../../fragments/profileFragments";
import { mergeProfiles } from "../../redux/profileSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";


const SET_INDEX_POST = gql`
  mutation SetCurrentProfileIndexPost($postId: String!) {
    setCurrentProfileIndexPost(postId: $postId) {
      ...ProfileFields
    }
  }
  ${PROFILE_FIELDS}
`;

const useSetCurrentProfileIndexPost = () => {
  const dispatch = useAppDispatch();

  const [set] = useMutation(SET_INDEX_POST, {
    onError: (err) => {
      console.error(err);
    },
    onCompleted: (data) => {
      console.log(data);
      
      dispatch(mergeProfiles([data.setCurrentProfileIndexPost]));
    },
  });

  const setCurrentProfileIndexPost = (postId: string) => {
    set({
      variables: {
        postId,
      },
    });
  }

  return setCurrentProfileIndexPost;
}

export default useSetCurrentProfileIndexPost;