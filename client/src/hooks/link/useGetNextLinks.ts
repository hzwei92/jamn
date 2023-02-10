import { gql, useMutation } from "@apollo/client";
import { LINK_FIELDS } from "../../fragments/linkFragments";
import { FULL_POST_FIELDS } from "../../fragments/postFragments";
import { mergeLinks } from "../../redux/linkSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Link } from "../../types/link";

const GET_NEXT_LINKS = gql`
  mutation GetNextLinks($postId: String!) {
    getNextLinks(postId: $postId) {
      ...LinkFields
      nextPost {
        ...FullPostFields
      }
    }
  }
  ${LINK_FIELDS}
  ${FULL_POST_FIELDS}
`;


interface GetNextLinksProps {
  onCompleted: (links: Link[]) => void;
}

const useGetNextLinks = ({ onCompleted }: GetNextLinksProps) => {
  const dispatch = useAppDispatch();

  const [get] = useMutation(GET_NEXT_LINKS, {
    onError: (err) => {
      console.error(err);
    },
    onCompleted: (data) => {
      console.log(data);

      dispatch(mergeLinks(data.getNextLinks));

      onCompleted(data.getNextLinks);
    },
  });

  const getNextLinks = (postId: string) => {
    get({
      variables: {
        postId,
      },
    });
  }

  return getNextLinks;
};

export default useGetNextLinks;