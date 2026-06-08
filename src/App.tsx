import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import './App.css';
import './index.css';

interface RouteProps {
  children: React.ReactNode;
}

// Private Route Guard Layer
const GuardedRoute = ({ children }: RouteProps) => {
  const token = localStorage.getItem('afml_session_token');
  return token ? <>{children}</> : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  const navigate = useNavigate();
  
  // Enforcing reactive component internal lifecycle states mapping
  const [empName, setEmpName] = useState<string>(localStorage.getItem('afml_user_name') || 'Employee');

  const handleAuthSuccess = (token: string, name: string) => {
    localStorage.setItem('afml_session_token', token);
    localStorage.setItem('afml_user_name', name);
    
    // Dynamically tracking variables inside memory states to trigger auto re-render safely
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
        path="/home" 
        element = {
          <GuardedRoute>
            <HomePage 
              empName={empName} 
              onLogout={handleLogoutWorkflow} 
            />
          </GuardedRoute>
        } 
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;