import { gql, useMutation } from "@apollo/client";
import { POST_FIELDS } from "../../fragments/postFragments";
import { PostDirection } from "../../enums";

const CREATE_POST = gql`
  mutation CreatePost($text: String!, $contextPostId: String!, $contextDirection: String!) {
    createPost(text: $text, contextPostId: $contextPostId, contextDirection: $contextDirection) {
      ...PostFields
    }
  }
  ${POST_FIELDS}
`;

const useCreatePost = () => {
  const [create] = useMutation(CREATE_POST, {
    onError: (err) => {
      console.error(err);
    },
    onCompleted: (data) => {
      console.log(data);
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