import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { Link } from '../types/link';

interface LinkState {
  idToLink: Record<string, Link>
}

const initialState: LinkState = {
  idToLink: {},
}

export const linkSlice = createSlice({
  name: 'link',
  initialState,
  reducers: {
    mergeLinks: (state, action: PayloadAction<Link[]>) => {
      action.payload.forEach(link => {
        state.idToLink[link.id] = link;
      });
    },
  },
})

export const { mergeLinks } = linkSlice.actions

export const selectIdToLink = (state: RootState) => state.link.idToLink

export const selectLinkById = createSelector([
  selectIdToLink,
  (_: RootState, id: string | null) => id,
], (idToLink, id) => id ? idToLink[id] : null);

export default linkSlice.reducer