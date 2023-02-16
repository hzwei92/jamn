import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { Profile } from '../types/profile';
import { mergePosts } from './postSlice';
import { mergeLinks } from './linkSlice';
import { mergePins } from './pinSlice';
import { mergeTabs } from './tabSlice';

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
  extraReducers: (builder) => {
    builder
      .addCase(mergePosts, (state, action) => {
        action.payload.forEach(post => {
          if (post.profile) {
            state.idToProfile[post.profile.id] = post.profile;
          }
        });
      })
      .addCase(mergeLinks, (state, action) => {
        action.payload.forEach(link => {
          if (link.prevPost?.profile) {
            state.idToProfile[link.prevPost.profile.id] = link.prevPost.profile;
          }
          if (link.nextPost?.profile) {
            state.idToProfile[link.nextPost.profile.id] = link.nextPost.profile;
          }
        });
      })
      .addCase(mergePins, (state, action) => {
        action.payload.forEach(pin => {
          if (pin.rootPost?.profile) {
            state.idToProfile[pin.rootPost?.profile.id] = pin.rootPost.profile;
          }
          if (pin.leafPost?.profile) {
            state.idToProfile[pin.leafPost?.profile.id] = pin.leafPost.profile;
          }
        });
      })
      .addCase(mergeTabs, (state, action) => {
        action.payload.forEach(tab => {
          if (tab.profile) {
            state.idToProfile[tab.profile.id] = tab.profile;
          }
          if (tab.post?.profile) {
            state.idToProfile[tab.post?.profile.id] = tab.post.profile;
          }
        }); 
      })
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
  (_: RootState, id: string | null) => id,
], (idToProfile, id) => id ? idToProfile[id] : null);

export default profileSlice.reducer