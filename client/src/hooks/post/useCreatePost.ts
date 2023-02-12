import { gql, useMutation } from "@apollo/client";
import { POST_FIELDS } from "../../fragments/postFragments";
import { PostDirection } from "../../enums";
import { useAppDispatch } from "../../redux/store";
import { setIsInit, setIsValid } from "../../redux/authSlice";
import { useIonToast } from "@ionic/react";

const CREATE_POST = gql`
  mutation CreatePost($text: String!, $contextPostId: String, $contextDirection: String) {
    createPost(text: $text, contextPostId: $contextPostId, contextDirection: $contextDirection) {
      ...PostFields
    }
  }
  ${POST_FIELDS}
`;

const useCreatePost = () => {
  const dispatch = useAppDispatch();

  const [present] = useIonToast();

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