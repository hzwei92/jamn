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
    back: (state) => {
      if (state.index > 0) {
        const slice = state.stack[state.index - 1];

        state.stack.splice(state.index - 1, 1, {
          ...slice,
          query: slice.originalQuery,
        });

        state.index--;
      }
    },
    forward: (state) => {
      if (state.index < state.stack.length - 1) {

        const slice = state.stack[state.index + 1];

        state.stack.splice(state.index + 1, 1, {
          ...slice,
          query: slice.originalQuery,
        });

        state.index++;
      }
    },
    pushPortalSlice: (state, action: PayloadAction<PortalSlice>) => {
      const stack = state.stack.slice(0, state.index + 1);
      stack.push(action.payload);
      state.stack = stack;
      state.index++;
    },
    splicePortalSlice: (state, action: PayloadAction<PortalSlice>) => {
      state.stack.splice(state.index, 1, action.payload);
    },
  },
});

export const { back, forward, pushPortalSlice,  splicePortalSlice } = portalSlice.actions

export const selectPortalStack = (state: RootState) => state.portal.stack
export const selectPortalIndex = (state: RootState) => state.portal.index

export const selectPortalSlice = createSelector(
  selectPortalStack,
  selectPortalIndex,
  (stack, index) => stack[index]
);

export default portalSlice.reducer