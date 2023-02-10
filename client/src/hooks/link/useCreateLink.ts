import { gql, useMutation } from "@apollo/client";
import { LINK_FIELDS } from "../../fragments/linkFragments";
import { FULL_POST_FIELDS } from "../../fragments/postFragments";
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

  const [create] = useMutation(CREATE_LINK, {
    onError: (err) => {
      console.error(err);
    },
    onCompleted: (data) => {
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