import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { Post } from '../types/post';
import { mergeLinks } from './linkSlice';
import { mergePins } from './pinSlice';

interface PostState {
  idToPost: Record<string, Post>
}

const initialState: PostState = {
  idToPost: {},
}

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    mergePosts: (state, action: PayloadAction<Post[]>) => {
      action.payload.forEach(post => {
        state.idToPost[post.id] = post;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(mergeLinks, (state, action) => {
        action.payload.forEach(link => {
          if (link.prevPost) {
            state.idToPost[link.prevPostId] = link.prevPost;
          }
          if (link.nextPost) {
            state.idToPost[link.nextPostId] = link.nextPost;
          }
        });
      })
      .addCase(mergePins, (state, action) => {
        action.payload.forEach(pin => {
          if (pin.rootPost) {
            state.idToPost[pin.rootPostId] = pin.rootPost;
          }
          if (pin.leafPost) {
            state.idToPost[pin.leafPostId] = pin.leafPost;
          }
        });
      })
  },
})

export const { mergePosts } = postSlice.actions

export const selectIdToPost = (state: RootState) => state.post.idToPost;

export const selectPostById = createSelector([
  selectIdToPost,
  (_: RootState, id: string | null) => id,
], (idToPost, id) => id ? idToPost[id] : null);

export default postSlice.reducer;