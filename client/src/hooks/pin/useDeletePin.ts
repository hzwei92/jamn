import { gql, useMutation } from "@apollo/client";
import { FULL_POST_FIELDS } from "../../fragments/postFragments";
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

  const [del] = useMutation(DELETE_PIN, {
    onError: (err) => {
      console.error(err);
    },
    onCompleted: (data) => {
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