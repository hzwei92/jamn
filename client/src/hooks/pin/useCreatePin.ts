import { gql, useMutation } from "@apollo/client";
import { useIonToast } from "@ionic/react";
import { PIN_FIELDS } from "../../fragments/pinFragments";
import { FULL_POST_FIELDS } from "../../fragments/postFragments";
import { setIsInit, setIsValid } from "../../redux/authSlice";
import { mergePins } from "../../redux/pinSlice";
import { useAppDispatch } from "../../redux/store";
import { Pin } from "../../types/pin";

const CREATE_PIN = gql`
  mutation CreatePin($rootPostId: String!, $leafPostId: String!) {
    createPin(rootPostId: $rootPostId, leafPostId: $leafPostId) {
      ...PinFields
      rootPost {
        ...FullPostFields
      }
      leafPost {
        ...FullPostFields
      }
    }
  }
  ${PIN_FIELDS}
  ${FULL_POST_FIELDS}
`;
 
interface UseCreatePinProps {
  onCompleted: (pin: Pin) => void;
}
const useCreatePin = ({ onCompleted }: UseCreatePinProps) => {
  const dispatch = useAppDispatch();

  const [present] = useIonToast();

  const [create] = useMutation(CREATE_PIN, {
    onError: (err) => {
      present('Error creating pin: ' + err.message, 4200);
      if (err.message === 'Unauthorized') {
        dispatch(setIsInit(false));
        dispatch(setIsValid(false));
      }
      else {
        console.error(err);
      }
    },
    onCompleted: (data) => {
      present('Pin created', 4200);

      console.log(data);

      dispatch(mergePins([data.createPin]));

      onCompleted(data.createPin);
    },
  });

  const createPin = (rootPostId: string, leafPostId: string) => {
    create({
      variables: {
        rootPostId,
        leafPostId,
      },
    });
  }

  return createPin;
}

export default useCreatePin;