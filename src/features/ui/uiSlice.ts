import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isSidebarOpen: boolean;
  openMenuIndex: number | null;
}

const initialState: UiState = {
  isSidebarOpen: false,
  openMenuIndex: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    toggleMenuIndex: (state, action: PayloadAction<number>) => {
      state.openMenuIndex = state.openMenuIndex === action.payload ? null : action.payload;
    },
    setOpenMenuIndex: (state, action: PayloadAction<number | null>) => {
      state.openMenuIndex = action.payload;
    },
    clearUiState: (state) => {
      state.openMenuIndex = null;
    }
  },
});

export const { setSidebarOpen, toggleMenuIndex, setOpenMenuIndex, clearUiState } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;