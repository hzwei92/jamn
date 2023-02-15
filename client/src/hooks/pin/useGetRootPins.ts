import { gql, useMutation } from "@apollo/client";
import { PIN_FIELDS } from "../../fragments/pinFragments";
import { FULL_POST_FIELDS } from "../../fragments/postFragments";
import { mergePins } from "../../redux/pinSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Pin } from "../../types/pin";

const GET_PREV_PINS = gql`
  mutation GetRootPins($postId: String!) {
    getRootPins(postId: $postId) {
      ...PinFields
      rootPost {
        ...FullPostFields
      }
    }
  }
  ${PIN_FIELDS}
  ${FULL_POST_FIELDS}
`;

interface UseGetRootPinsProps {
  onCompleted: (pins: Pin[]) => void;
}

const useGetRootPins = ({ onCompleted }: UseGetRootPinsProps) => {
  const dispatch = useAppDispatch();

  const [get] = useMutation(GET_PREV_PINS, {
    onError: (err) => {
      console.error(err);
    },
    onCompleted: (data) => {
      console.log(data);

      dispatch(mergePins(data.getRootPins));

      onCompleted(data.getRootPins);
    },
  });

  const getRootPins = (postId: string | null) => {
    if (!postId) return;
    
    get({
      variables: {
        postId,
      },
    });
  }

  return getRootPins;
};

export default useGetRootPins;