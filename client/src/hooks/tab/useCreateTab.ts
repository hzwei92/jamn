import { gql, useMutation } from "@apollo/client";
import { FULL_POST_FIELDS } from "../../fragments/postFragments";
import { TAB_FIELDS } from "../../fragments/tabFragments";
import { useAppDispatch } from "../../redux/store";
import { mergeTabs } from "../../redux/tabSlice";
import { Tab } from "../../types/tab";

const CREATE_TAB = gql`
  mutation CreateTab($postId: String!) {
    createTab(postId: $postId) {
      ...TabFields
      post {
        ...FullPostFields
      }
    }
  }
  ${TAB_FIELDS}
  ${FULL_POST_FIELDS}
`;

interface UseCreateTabProps {
  onCompleted: (tab: Tab) => void;
}
const useCreateTab = ({ onCompleted }: UseCreateTabProps) => {
  const dispatch = useAppDispatch();

  const [create] = useMutation(CREATE_TAB, {
    onError: (err) => {
      console.error(err);
    },
    onCompleted: (data) => {
      console.log(data);

      dispatch(mergeTabs([data.createTab]));

      onCompleted(data.createTab);
    },
  });

  const createTab = (postId: string) => {
    create({
      variables: {
        postId,
      }
    })
  }

  return createTab;
}

export default useCreateTab;