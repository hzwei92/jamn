import { Preferences } from "@capacitor/preferences";
import { googleLogout } from "@react-oauth/google";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../../constants";


const useLogout = () => {
  const logout = () => {
    googleLogout();
    
    Preferences.remove({ key: ACCESS_TOKEN_KEY });
    Preferences.remove({ key: REFRESH_TOKEN_KEY });

    window.location.reload();
  }

  return logout;
}

export default useLogout;