import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/**
 * Use this instead of plain `useDispatch` for type safety
 * This gives us correctly typed dispatch functions
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Use this instead of plain `useSelector` for type safety
 * This gives us correctly typed state
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;