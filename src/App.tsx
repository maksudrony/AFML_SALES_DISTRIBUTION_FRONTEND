import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import DynamicRouter from './routes/DynamicRouter';
import { storage } from './utils/storage';
import { useAppDispatch } from './hooks/useAppDispatch';
import { useAppSelector } from './hooks/useAppSelector';
import { clearAuthCredentials } from './features/auth/authSlice';
import { clearUiState } from './features/ui/uiSlice';
import { clearAllReportFilters } from './features/reportCache/reportFiltersCacheSlice';
import { baseApi } from './services/api';

interface GuardProps {
  children: React.ReactNode;
}

const GuardedRoute = ({ children }: GuardProps) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogoutWorkflow = () => {
    storage.clearAll();
    
    // Redux State Clear Slice er state clear korar jonno dispatch call kora hocche
    dispatch(clearAuthCredentials());
    dispatch(clearUiState());
    dispatch(clearAllReportFilters());
    
    //RTK Query Cache Clear
    dispatch(baseApi.util.resetApiState())

    navigate('/', { replace: true });
  };

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route 
        path="/*" 
        element={
          <GuardedRoute>
            <HomePage empName={user?.empName || 'Employee'} onLogout={handleLogoutWorkflow}>
              <DynamicRouter />
            </HomePage>
          </GuardedRoute>
        } 
      />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}