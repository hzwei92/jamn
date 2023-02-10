import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { Pin } from '../types/pin';

interface PinState {
  idToPin: Record<string, Pin>
}

const initialState: PinState = {
  idToPin: {},
}

export const pinSlice = createSlice({
  name: 'pin',
  initialState,
  reducers: {
    mergePins: (state, action: PayloadAction<Pin[]>) => {
      action.payload.forEach(pin => {
        state.idToPin[pin.id] = pin;
      });
    },
  },
})

export const { mergePins } = pinSlice.actions

export const selectIdToPin = (state: RootState) => state.pin.idToPin

export const selectPinById = createSelector([
  selectIdToPin,
  (_: RootState, id: string | null) => id,
], (idToPin, id) => id ? idToPin[id] : null);

export default pinSlice.reducer