import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface AuthState {
  isInit: boolean;
  isValid: boolean;
  isDone: boolean;
  refreshInterval: ReturnType<typeof setInterval> | null;
  profileIdToAccessToken: Record<string, string>;
  profileIdToRefreshToken: Record<string, string>;
}

const initialState: AuthState = {
  isInit: false,
  isValid: false,
  isDone: false,
  refreshInterval: null,
  profileIdToAccessToken: {},
  profileIdToRefreshToken: {},
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsInit: (state, action: PayloadAction<boolean>) => {
      state.isInit = action.payload;
    },
    setIsValid: (state, action: PayloadAction<boolean>) => {
      state.isValid = action.payload;
    },
    setIsDone: (state, action: PayloadAction<boolean>) => {
      state.isDone = action.payload;
    },
    setRefreshInterval: (state, action: PayloadAction<ReturnType<typeof setInterval> | null>) => {
      state.refreshInterval = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<{ profileId: string, accessToken: string }>) => {
      const { profileId, accessToken } = action.payload;
      state.profileIdToAccessToken[profileId] = accessToken;
    },
    setRefreshToken: (state, action: PayloadAction<{ profileId: string, refreshToken: string }>) => {
      const { profileId, refreshToken } = action.payload;
      state.profileIdToRefreshToken[profileId] = refreshToken;
    },
  },
});

export const {
  setIsInit,
  setIsValid,
  setIsDone,
  setRefreshInterval,
  setAccessToken,
  setRefreshToken,
} = authSlice.actions;

export default authSlice.reducer;

export const selectIsInit = (state: RootState) => state.auth.isInit;
export const selectIsValid = (state: RootState) => state.auth.isValid;
export const selectIsDone = (state: RootState) => state.auth.isDone;
export const selectRefreshInterval = (state: RootState) => state.auth.refreshInterval;
export const selectProfileIdToAccessToken = (state: RootState) => state.auth.profileIdToAccessToken;
export const selectProfileIdToRefreshToken = (state: RootState) => state.auth.profileIdToRefreshToken;

