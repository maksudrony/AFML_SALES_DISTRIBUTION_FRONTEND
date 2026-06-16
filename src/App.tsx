import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import DynamicRouter from './routes/DynamicRouter';
import type { IMenuItem } from './types/auth';

interface GuardProps {
  children: React.ReactNode;
}

const GuardedRoute = ({ children }: GuardProps) => {
  const token = localStorage.getItem('afml_session_token');
  return token ? <>{children}</> : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  const navigate = useNavigate();
  const [empName, setEmpName] = useState<string>(localStorage.getItem('afml_user_name') || 'Employee');

  // Fixed 'unexpected any' and signature mismatches exactly
  const handleAuthSuccess = (token: string, name: string, menuTree: IMenuItem[]) => {
    localStorage.setItem('afml_session_token', token);
    localStorage.setItem('afml_user_name', name);
    localStorage.setItem('afml_user_menu', JSON.stringify(menuTree));
    
    setEmpName(name);
    navigate('/home', { replace: true });
  };

  const handleLogoutWorkflow = () => {
    localStorage.clear();
    setEmpName('Employee');
    navigate('/', { replace: true });
  };

  return (
    <Routes>
      <Route path="/" element={<LoginPage onAuthSuccess={handleAuthSuccess} />} />
      
      <Route 
        path="/*" 
        element={
          <GuardedRoute>
            <HomePage empName={empName} onLogout={handleLogoutWorkflow}>
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