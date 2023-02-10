import { gql, useMutation } from "@apollo/client";
import { PIN_FIELDS } from "../../fragments/pinFragments";
import { FULL_POST_FIELDS } from "../../fragments/postFragments";
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

  const [create] = useMutation(CREATE_PIN, {
    onError: (err) => {
      console.error(err);
    },
    onCompleted: (data) => {
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