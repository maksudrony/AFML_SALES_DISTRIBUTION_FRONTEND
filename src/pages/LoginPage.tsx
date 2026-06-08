import React, { useState } from 'react';
import { User, Lock, Grid } from 'lucide-react';
import { InputField } from '../components/InputField';
import { apiClient } from '../api/apiClient';
import type { ILoginResponse } from '../types/auth';
import loginBg from '../assets/home_Image.png';

interface LoginPageProps {
  onAuthSuccess: (token: string, empName: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onAuthSuccess }) => {
  const [empEnroll, setEmpEnroll] = useState('');
  const [empPwd, setEmpPwd] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const enrollmentId = parseFloat(empEnroll);
    if (isNaN(enrollmentId)) {
      setErrorMsg('Invalid Enrollment ID.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.post<ILoginResponse>('/auth/login', {
        empEnroll: enrollmentId,
        empPwd
      });

      if (response.data.statusCode === 1) {
        onAuthSuccess(response.data.token, response.data.empName);
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response: { data?: ILoginResponse } };
        setErrorMsg(axiosError.response.data?.message || 'Login failed.');
      } else {
        setErrorMsg('Server connection failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen m-0 p-0 overflow-hidden select-none z-50 flex flex-col justify-between items-center">
      {/* Absolute Full Screen Background Force Fit */}
      <img 
        src={loginBg} 
        alt="AFML Background" 
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />
      <div className="absolute inset-0 bg-slate-900/5 backdrop-brightness-95 z-10" />
      
      <div /> {/* Top Spacer */}

      {/* Floating Center Card - Fluid Responsive Bounds */}
      <div className="w-full max-w-[410px] bg-white/85 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl border border-white/50 relative z-20 text-center mx-auto my-auto">
        <div className="mx-auto w-11 h-11 bg-linear-to-br from-orange-500 to-orange-600 rounded-md flex items-center justify-center shadow-md mb-3 text-white">
          <Grid className="w-5 h-5 stroke-2" />
        </div>

        <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-6">
          Sales And Distribution
        </h2>

        <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
          <InputField
            id="empEnroll"
            type="text"
            value={empEnroll}
            placeholder="Username"
            onChange={setEmpEnroll}
            icon={<User className="w-4 h-4" />}
          />

          <InputField
            id="empPwd"
            type="password"
            value={empPwd}
            placeholder="Manage Passwords"
            onChange={setEmpPwd}
            icon={<Lock className="w-4 h-4" />}
          />

          {errorMsg && (
            <div className="p-3 bg-red-50 text-xs font-semibold text-red-600 border border-red-200 rounded-md">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded-sm bg-white" 
              />
              Remember username
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-700/60 font-bold py-2.5 rounded-md text-sm transition-all shadow-xs cursor-pointer active:scale-95"
          >
            {isLoading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
      </div>

      {/* Persistent Bottom Fixed Banner */}
      <div className="w-full text-center relative z-20 text-[10px] sm:text-xs font-bold text-slate-700 max-w-4xl py-2 bg-white/30 backdrop-blur-sm rounded-md border border-white/20 shadow-xs mb-4">
        সানশাইন আটা | ময়দা | সুজি এন্টারপ্রাইজ সিস্টেম
      </div>
    </div>
  );
};