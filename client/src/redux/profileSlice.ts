import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { Profile } from '../types/profile';

interface ProfileState {
  currentProfileId: string | null;
  idToProfile: Record<string, Profile>
}

const initialState: ProfileState = {
  currentProfileId: null,
  idToProfile: {},
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setCurrentProfileId: (state, action: PayloadAction<string | null>) => {
      state.currentProfileId = action.payload;
    },
    mergeProfiles: (state, action: PayloadAction<Profile[]>) => {
      action.payload.forEach(profile => {
        state.idToProfile[profile.id] = profile;
      });
    },
  },
})

export const { 
  setCurrentProfileId,
  mergeProfiles 
} = profileSlice.actions

export const selectCurrentProfileId = (state: RootState) => state.profile.currentProfileId;
export const selectIdToProfile = (state: RootState) => state.profile.idToProfile;

export const selectCurrentProfile = (state: RootState): Profile | null => state.profile.currentProfileId
  ? state.profile.idToProfile[state.profile.currentProfileId]
  : null;

export const selectProfileById = createSelector([
  selectIdToProfile,
  (_: RootState, id: string) => id,
], (idToProfile, id) => idToProfile[id]);

export default profileSlice.reducer