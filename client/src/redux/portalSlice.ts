import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { PortalSlice } from '../types/portal';

interface PortalState {
  stack: PortalSlice[];
  index: number;
}

const initialState: PortalState = {
  stack: [],
  index: -1,
}

export const portalSlice = createSlice({
  name: 'portal',
  initialState,
  reducers: {
    pushPortalSlice: (state, action: PayloadAction<PortalSlice>) => {
      state.stack.push(action.payload);
      state.index++;
      return state;
    },
    splicePortalSlice: (state, action: PayloadAction<PortalSlice>) => {
      state.stack.splice(state.index, 1, action.payload);
      return state;
    },
  },
});

export const { pushPortalSlice,  splicePortalSlice } = portalSlice.actions

export const selectPortalStack = (state: RootState) => state.portal.stack
export const selectPortalIndex = (state: RootState) => state.portal.index

export const selectPortalSlice = createSelector(
  selectPortalStack,
  selectPortalIndex,
  (stack, index) => stack[index]
);

export default portalSlice.reducer