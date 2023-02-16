import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authSlice from './authSlice';
import entrySlice from './entrySlice';
import linkSlice from './linkSlice';
import pinSlice from './pinSlice';
import portalSlice from './portalSlice';
import postSlice from './postSlice';
import profileSlice from './profileSlice';
import tabSlice from './tabSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    entry: entrySlice,
    link: linkSlice,
    portal: portalSlice,
    pin: pinSlice,
    post: postSlice,
    profile: profileSlice,
    tab: tabSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, pins: PinsState, users: UsersState}
export type AppDispatch = typeof store.dispatch


export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

