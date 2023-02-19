import { gql, useMutation } from "@apollo/client";
import { Preferences } from "@capacitor/preferences";
import { ACCESS_TOKEN_KEY, REFRESH_ACCESS_TOKEN_TIME, REFRESH_TOKEN_KEY } from "../../constants";
import { setAccessToken, setIsInit, setIsValid, setRefreshInterval } from "../../redux/authSlice";
import { useAppDispatch } from "../../redux/store";

const REFRESH_ACCESS_TOKEN = gql`
  mutation RefreshAccessToken($refreshToken: String!) {
    refreshAccessToken(refreshToken: $refreshToken) {
      profile {
        id
      }
      accessToken
      refreshToken
    }
  }
`;

const useRefreshAccessToken = () => {
  const dispatch = useAppDispatch();

  const [refresh] = useMutation(REFRESH_ACCESS_TOKEN, {
    onError: (err) => {
      console.error(err);

      dispatch(setIsValid(false));
      dispatch(setIsInit(true));
      dispatch(setRefreshInterval(null));
    },
    onCompleted: async (data) => {
      console.log(data);
      const { profile, accessToken } = data.refreshAccessToken;

      if (accessToken) {
        dispatch(setAccessToken({
          profileId: profile.id,
          accessToken,
        }));

        await Preferences.set({
          key: ACCESS_TOKEN_KEY,
          value: accessToken,
        });

        dispatch(setIsValid(true));
      }
      else {
        dispatch(setIsValid(false));
        dispatch(setRefreshInterval(null));
      }
      dispatch(setIsInit(true));
    },
  });

  const refreshToken = async () => {
    const refreshToken = await Preferences.get({ key: REFRESH_TOKEN_KEY });

    if (refreshToken.value) {
      refresh({
        variables: {
          refreshToken: refreshToken.value,
        },
      });
    }
    else {
      dispatch(setIsValid(false));
      dispatch(setRefreshInterval(null));
      dispatch(setIsInit(true));
    }
  };

  const refreshTokenInterval = () => {
    const interval = setInterval(() => {
      refreshToken();
    }, REFRESH_ACCESS_TOKEN_TIME);
    
    dispatch(setRefreshInterval(interval));
  }

  return { refreshToken, refreshTokenInterval };
}

export default useRefreshAccessToken;