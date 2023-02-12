import { gql, useMutation } from "@apollo/client";
import { useIonToast } from "@ionic/react";
import { LINK_FIELDS } from "../../fragments/linkFragments";
import { FULL_POST_FIELDS } from "../../fragments/postFragments";
import { setIsInit, setIsValid } from "../../redux/authSlice";
import { mergeLinks } from "../../redux/linkSlice";
import { useAppDispatch } from "../../redux/store";
import { Link } from "../../types/link";

const CREATE_LINK = gql`
  mutation CreateLink($prevPostId: String!, $nextPostId: String!) {
    createLink(prevPostId: $prevPostId, nextPostId: $nextPostId) {
      ...LinkFields
      prevPost {
        ...FullPostFields
      }
      nextPost {
        ...FullPostFields
      }
    }
  }
  ${LINK_FIELDS}
  ${FULL_POST_FIELDS}
`;
 
interface UseCreateLinkProps {
  onCompleted: (link: Link) => void;
}
const useCreateLink = ({ onCompleted }: UseCreateLinkProps) => {
  const dispatch = useAppDispatch();

  const [present] = useIonToast();

  const [create] = useMutation(CREATE_LINK, {
    onError: (err) => {
      present('Error creating link: ' + err.message, 4200)
      if (err.message === 'Unauthorized') {
        dispatch(setIsInit(false));
        dispatch(setIsValid(false));
      }
      else {
        console.error(err);
      }
    },
    onCompleted: (data) => {
      present('Link created', 4200);
      
      console.log(data);

      dispatch(mergeLinks([data.createLink]));

      onCompleted(data.createLink);
    },
  });

  const createLink = (prevPostId: string, nextPostId: string) => {
    create({
      variables: {
        prevPostId,
        nextPostId,
      },
    });
  }

  return createLink;
}

export default useCreateLink;