import { gql, useMutation } from "@apollo/client";
import { FULL_POST_FIELDS } from "../../fragments/postFragments";
import { TAB_FIELDS } from "../../fragments/tabFragments";
import { useAppDispatch } from "../../redux/store";
import { mergeTabs } from "../../redux/tabSlice";
import { Tab } from "../../types/tab";

const GET_TABS = gql`
  mutation GetTabs($profileId: String!) {
    getTabs(profileId: $profileId) {
      ...TabFields
      post {
        ...FullPostFields
      }
    }
  }
  ${TAB_FIELDS}
  ${FULL_POST_FIELDS}
`;

interface UseGetTabsProps {
  onCompleted: (tabs: Tab[]) => void;
}

const useGetTabs = ({ onCompleted }: UseGetTabsProps) => {
  const dispatch = useAppDispatch();

  const [get] = useMutation(GET_TABS, {
    onError: (err) => {
      console.error(err);
    },
    onCompleted: (data) => {
      console.log(data);

      dispatch(mergeTabs(data.getTabs));

      onCompleted(data.getTabs);
    }
  });

  const getTabs = (profileId: string) => {
    get({
      variables: {
        profileId,
      },
    })
  }

  return getTabs;
}

export default useGetTabs;