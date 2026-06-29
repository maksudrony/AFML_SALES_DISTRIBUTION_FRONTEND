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
    clearUiState: (state) => {
      state.openMenuIndex = null;
    }
  },
});

export const { setSidebarOpen, toggleMenuIndex, clearUiState } = uiSlice.actions;
export default uiSlice.reducer;