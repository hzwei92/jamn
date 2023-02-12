import { gql, useMutation } from "@apollo/client";
import { PROFILE_FIELDS } from "../../fragments/profileFragments";
import { setIsDone } from "../../redux/authSlice";
import { mergeProfiles, setCurrentProfileId } from "../../redux/profileSlice";
import { useAppDispatch } from "../../redux/store";
import useRefreshAccessToken from "../auth/useRefreshToken";

const GET_CURRENT_PROFILE = gql`
  mutation GetCurrentProfile {
    getCurrentProfile {
      ...ProfileFields
    }
  }
  ${PROFILE_FIELDS}
`;

const useGetCurrentProfile = () => {
  const dispatch = useAppDispatch();

  const { refreshTokenInterval } = useRefreshAccessToken();

  const [get] = useMutation(GET_CURRENT_PROFILE, {
    onError: (err) => {
      console.error(err);
    },
    onCompleted: (data) => {
      console.log(data);

      refreshTokenInterval();

      dispatch(mergeProfiles([data.getCurrentProfile]));

      dispatch(setCurrentProfileId(data.getCurrentProfile.id));

      dispatch(setIsDone(true));
    }
  });

  const getCurrentProfile = () => {
    get();
  }

  return getCurrentProfile;
}

export default useGetCurrentProfile;