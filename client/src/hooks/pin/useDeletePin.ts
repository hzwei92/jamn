import { gql, useMutation } from "@apollo/client";
import { useIonToast } from "@ionic/react";
import { FULL_POST_FIELDS } from "../../fragments/postFragments";
import { setIsInit, setIsValid } from "../../redux/authSlice";
import { mergePins } from "../../redux/pinSlice";
import { useAppDispatch } from "../../redux/store";

const DELETE_PIN = gql`
  mutation DeletePin($pinId: String!) {
    deletePin(pinId: $pinId) {
      id
      deleteDate
      rootPost {
        ...FullPostFields
      }
      leafPost {
        ...FullPostFields
      }
    }
  }
  ${FULL_POST_FIELDS}
`; 
const useDeletePin = () => {
  const dispatch = useAppDispatch();

  const [present] = useIonToast();

  const [del] = useMutation(DELETE_PIN, {
    onError: (err) => {
      present('Error deleting pin: ' + err.message, 4200);
      if (err.message === 'Unauthorized') {
        dispatch(setIsInit(false));
        dispatch(setIsValid(false));
      }
      else {
        console.error(err);
      }
    },
    onCompleted: (data) => {
      present('Pin deleted', 4200);
      
      console.log(data);

      dispatch(mergePins([data.deletePin]));
    },
  });

  const deletePin = (pinId: string) => {
    del({
      variables: {
        pinId,
      }
    });
  }

  return deletePin;
}

export default useDeletePin;