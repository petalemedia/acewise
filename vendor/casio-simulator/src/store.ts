import { configureStore, combineReducers } from "@reduxjs/toolkit";
import calcReducer, { initialState } from "./calcSlice";
const rootReducer = combineReducers({ calc: calcReducer });
export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({ reducer: rootReducer, preloadedState });
}
function restoreState(): Partial<RootState> | undefined {
  try {
    const saved = JSON.parse(sessionStorage.getItem('study-fx82-state') || 'null');
    if (saved && Array.isArray(saved.expression) && typeof saved.currentOperand === 'string') return { calc: { ...initialState, ...saved } };
  } catch { /* A fresh calculator is available even when storage is blocked. */ }
}
export const store = setupStore(restoreState());
store.subscribe(() => { try { sessionStorage.setItem('study-fx82-state', JSON.stringify(store.getState().calc)); } catch { /* In-memory state remains usable. */ } });
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
