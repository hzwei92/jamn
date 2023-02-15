import { gql, useMutation } from "@apollo/client";
import { FULL_POST_FIELDS, POST_FIELDS } from "../../fragments/postFragments";
import { VOTE_FIELDS } from "../../fragments/voteFragments";
import { mergePosts } from "../../redux/postSlice";
import { useAppDispatch } from "../../redux/store";

const VOTE = gql`
  mutation Vote($postId: String!, $value: Int!) {
    vote(postId: $postId, value: $value) {
      ...VoteFields
      post {
        ...FullPostFields
      }
    }
  }
  ${VOTE_FIELDS}
  ${FULL_POST_FIELDS}
`;


const useVote = () => {
  const dispatch = useAppDispatch();

  const [fetch] = useMutation(VOTE, {
    onError: err => {
      console.error(err);
    },
    onCompleted: data => {
      console.log(data);

      dispatch(mergePosts([data.vote.post]));
    },
  });

  const vote = (postId: string, value: number) => {
    fetch({
      variables: {
        postId,
        value,
      },
    });
  }

  return vote;
}

export default useVote;