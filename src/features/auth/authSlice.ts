import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { storage } from '../../utils/storage';
import type { IMenuItem } from '../../types/auth';

interface AuthState {
  token: string | null;
  user: {
    empName: string;
    empEnroll: string;
  } | null;
  menuTree: IMenuItem[];
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: storage.getToken(),
  user: storage.getToken() ? {
    empName: storage.getUserName(),
    empEnroll: storage.getUserEnroll(),
  } : null,
  menuTree: storage.getMenuTree(),
  isAuthenticated: !!storage.getToken(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state, 
      action: PayloadAction<{ token: string; empName: string; empEnroll: string; menuTree: IMenuItem[] }>
    ) => {
      state.token = action.payload.token;
      state.user = {
        empName: action.payload.empName,
        empEnroll: action.payload.empEnroll,
      };
      state.menuTree = action.payload.menuTree;
      state.isAuthenticated = true;
    },
    clearAuthCredentials: (state) => {
      state.token = null;
      state.user = null;
      state.menuTree = [];
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, clearAuthCredentials } = authSlice.actions;
export const authReducer = authSlice.reducer;