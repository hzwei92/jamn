import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { Tab } from '../types/tab';
import { mergeLinks } from './linkSlice';
import { mergePins } from './pinSlice';

interface TabState {
  idToTab: Record<string, Tab>
}

const initialState: TabState = {
  idToTab: {},
}

export const tabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    mergeTabs: (state, action: PayloadAction<Tab[]>) => {
      action.payload.forEach(tab => {
        state.idToTab[tab.id] = tab;
      });
    },
  },
})

export const { mergeTabs } = tabSlice.actions

export const selectIdToTab = (state: RootState) => state.tab.idToTab;

export const selectTabById = createSelector([
  selectIdToTab,
  (_: RootState, id: string | null) => id,
], (idToTab, id) => id ? idToTab[id] : null);

export default tabSlice.reducer;