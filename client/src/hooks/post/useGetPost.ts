import { gql, useMutation } from "@apollo/client";
import { FULL_POST_FIELDS } from "../../fragments/postFragments";
import { mergePosts } from "../../redux/postSlice";
import { useAppDispatch } from "../../redux/store";
import { Post } from "../../types/post";

const GET_POSTS = gql`
  mutation GetPost($postId: String!) {
    getPost(postId: $postId) {
      ...FullPostFields
    }
  }
  ${FULL_POST_FIELDS}
`;

interface UseGetPostProps {
  onCompleted: (post: Post) => void;
}
const useGetPost = ({ onCompleted }: UseGetPostProps) => {
  const dispatch = useAppDispatch();

  const [get] = useMutation(GET_POSTS, {
    onError: (err) => {
      console.error(err);
    },
    onCompleted: (data) => {
      console.log(data);

      dispatch(mergePosts([data.getPost]));

      onCompleted(data.getPost);
    },
    fetchPolicy: "network-only",
  });

  const getPost = (postId: string) => {
    get({
      variables: {
        postId,
      }
    });
  }

  return getPost;
}

export default useGetPost;