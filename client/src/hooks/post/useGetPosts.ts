import { gql, useMutation } from "@apollo/client";
import { FULL_POST_FIELDS } from "../../fragments/postFragments";
import { mergePosts } from "../../redux/postSlice";
import { useAppDispatch } from "../../redux/store";
import { Post } from "../../types/post";

const GET_POSTS = gql`
  mutation GetPosts {
    getPosts {
      ...FullPostFields
    }
  }
  ${FULL_POST_FIELDS}
`;

interface UseGetPostsProps {
  onCompleted: (posts: Post[]) => void;
}
const useGetPosts = ({ onCompleted }: UseGetPostsProps) => {
  const dispatch = useAppDispatch();

  const [get] = useMutation(GET_POSTS, {
    onError: (err) => {
      console.error(err);
    },
    onCompleted: (data) => {
      console.log(data);

      dispatch(mergePosts(data.getPosts));

      onCompleted(data.getPosts);
    },
    fetchPolicy: "network-only",
  });

  const getPosts = () => {
    get();
  }

  return getPosts;
}

export default useGetPosts;