import { gql, useMutation } from "@apollo/client";
import { useIonToast } from "@ionic/react";
import { FULL_POST_FIELDS } from "../../fragments/postFragments";
import { setIsInit, setIsValid } from "../../redux/authSlice";
import { mergeTabs } from "../../redux/tabSlice";
import { useAppDispatch } from "../../redux/store";
import { PROFILE_FIELDS } from "../../fragments/profileFragments";

const DELETE_TAB = gql`
  mutation DeleteTab($tabId: String!) {
    deleteTab(tabId: $tabId) {
      id
      deleteDate
      profile {
        ...ProfileFields
      }
      post {
        ...FullPostFields
      }
    }
  }
  ${PROFILE_FIELDS}
  ${FULL_POST_FIELDS}
`; 
const useDeleteTab = () => {
  const dispatch = useAppDispatch();

  const [present] = useIonToast();

  const [del] = useMutation(DELETE_TAB, {
    onError: (err) => {
      present('Error deleting tab: ' + err.message, 4200);
      if (err.message === 'Unauthorized') {
        dispatch(setIsInit(false));
        dispatch(setIsValid(false));
      }
      else {
        console.error(err);
      }
    },
    onCompleted: (data) => {
      present('Tab deleted', 4200);
      
      console.log(data);

      dispatch(mergeTabs([data.deleteTab]));
    },
  });

  const deleteTab = (tabId: string) => {
    del({
      variables: {
        tabId,
      }
    });
  }

  return deleteTab;
}

export default useDeleteTab;