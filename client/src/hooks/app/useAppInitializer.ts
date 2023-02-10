import { Preferences } from "@capacitor/preferences";
import { useContext, useEffect } from "react";
import { AppContext } from "../../components/app/AppProvider";
import { REFRESH_TOKEN_KEY } from "../../constants";
import { selectIsDone, selectIsInit, selectIsValid, setIsDone, setIsInit } from "../../redux/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import useGetCurrentProfile from "../profile/useGetCurrentProfile";
import useRefreshAccessToken from "../auth/useRefreshToken";

const useAppInitializer = () => {
  const dispatch = useAppDispatch();

  const { refreshToken } = useRefreshAccessToken();

  const getCurrentProfile = useGetCurrentProfile();

  const { 
    isDarkMode,
  } = useContext(AppContext);

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const isInit = useAppSelector(selectIsInit);
  const isValid = useAppSelector(selectIsValid);
  const isDone = useAppSelector(selectIsDone);

  useEffect(() => {
    if (isInit) return;
    refreshToken();
  }, [isInit]);


  useEffect(() => {
    if (!isInit || isDone) return;

    if (isValid) {
      getCurrentProfile();
    }
    else {
      dispatch(setIsDone(true));
    }
  }, [isInit, isValid, isDone]);
}

export default useAppInitializer;