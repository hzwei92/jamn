import { gql, useMutation } from "@apollo/client";
import { PIN_FIELDS } from "../../fragments/pinFragments";
import { FULL_POST_FIELDS } from "../../fragments/postFragments";
import { mergePins } from "../../redux/pinSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Pin } from "../../types/pin";

const GET_PREV_PINS = gql`
  mutation GetLeafPins($postId: String!) {
    getLeafPins(postId: $postId) {
      ...PinFields
      leafPost {
        ...FullPostFields
      }
    }
  }
  ${PIN_FIELDS}
  ${FULL_POST_FIELDS}
`;

interface UseGetLeafPinsProps {
  onCompleted: (pins: Pin[]) => void;
}

const useGetLeafPins = ({ onCompleted }: UseGetLeafPinsProps) => {
  const dispatch = useAppDispatch();

  const [get] = useMutation(GET_PREV_PINS, {
    onError: (err) => {
      console.error(err);
    },
    onCompleted: (data) => {
      console.log(data);

      dispatch(mergePins(data.getLeafPins));

      onCompleted(data.getLeafPins);
    },
  });

  const getLeafPins = (postId: string) => {
    get({
      variables: {
        postId,
      },
    });
  }

  return getLeafPins;
};

export default useGetLeafPins;