import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Entry } from '../types/entry';
import { RootState } from './store';

export interface EntryState {
  idToEntry: Record<string, Entry>;
};

const initialState: EntryState = {
  idToEntry: {},
};

export const entrySlice = createSlice({
  name: 'entry',
  initialState,
  reducers: {
    mergeEntries: (state, action: PayloadAction<Entry[]>) => {
      action.payload.forEach((entry) => {
        state.idToEntry[entry.id] = entry;
      })
    },
  },
});

export const {
  mergeEntries,
} = entrySlice.actions;

export const selectIdToEntry = (state: RootState) => state.entry.idToEntry;

export const selectEntryById = createSelector([
  selectIdToEntry,
  (_: RootState, id: string | null) => id,
], (idToEntry, id) => id ? idToEntry[id] : null);


export default entrySlice.reducer