import { gql, useMutation } from "@apollo/client";
import { LINK_FIELDS } from "../../fragments/linkFragments";
import { FULL_POST_FIELDS } from "../../fragments/postFragments";
import { mergeLinks } from "../../redux/linkSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Link } from "../../types/link";

const GET_PREV_LINKS = gql`
  mutation GetPrevLinks($postId: String!) {
    getPrevLinks(postId: $postId) {
      ...LinkFields
      prevPost {
        ...FullPostFields
      }
    }
  }
  ${LINK_FIELDS}
  ${FULL_POST_FIELDS}
`;

interface GetPrevLinksProps {
  onCompleted: (links: Link[]) => void;
}

const useGetPrevLinks = ({ onCompleted }: GetPrevLinksProps) => {
  const dispatch = useAppDispatch();

  const [get] = useMutation(GET_PREV_LINKS, {
    onError: (err) => {
      console.error(err);
    },
    onCompleted: (data) => {
      console.log(data);

      dispatch(mergeLinks(data.getPrevLinks));

      onCompleted(data.getPrevLinks);
    },
  });

  const getPrevLinks = (postId: string) => {
    get({
      variables: {
        postId,
      },
    });
  }

  return getPrevLinks;
};

export default useGetPrevLinks;