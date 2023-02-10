import { gql, useMutation } from "@apollo/client";
import { Preferences } from "@capacitor/preferences";
import { ACCESS_TOKEN_KEY, REFRESH_ACCESS_TOKEN_TIME, REFRESH_TOKEN_KEY } from "../../constants";
import { PROFILE_FIELDS } from "../../fragments/profileFragments";
import { setAccessToken, setIsDone, setIsValid, setRefreshInterval, setRefreshToken } from "../../redux/authSlice";
import { mergeProfiles, setCurrentProfileId } from "../../redux/profileSlice";
import { useAppDispatch } from "../../redux/store";
import useRefreshAccessToken from "./useRefreshToken";

const LOGIN = gql`
  mutation Login($credential: String!) {
    login(credential: $credential) {
      profile {
        ...ProfileFields
      }
      accessToken
      refreshToken
    }
  }
  ${PROFILE_FIELDS}
`;

const useLogin = () => {
  const dispatch = useAppDispatch();

  const { refreshTokenInterval } = useRefreshAccessToken();

  const [fetchLogin] = useMutation(LOGIN, {
    onError: (err) => {
      console.error(err);
    },
    onCompleted: (data) => {
      console.log(data);
      const { profile, accessToken, refreshToken } = data.login;

      refreshTokenInterval();

      dispatch(setAccessToken({
        profileId: profile.id,
        accessToken,
      }));

      dispatch(setRefreshToken({
        profileId: profile.id,
        refreshToken,
      }));

      Preferences.set({
        key: ACCESS_TOKEN_KEY,
        value: accessToken,
      });

      Preferences.set({
        key: REFRESH_TOKEN_KEY,
        value: refreshToken,
      });

      dispatch(mergeProfiles([profile]));

      dispatch(setCurrentProfileId(profile.id));

      dispatch(setIsValid(true));
      dispatch(setIsDone(true));
    },
  });

  const login = (credential: string) => {
    fetchLogin({ variables: { credential } });
  }

  return login;
}

export default useLogin;