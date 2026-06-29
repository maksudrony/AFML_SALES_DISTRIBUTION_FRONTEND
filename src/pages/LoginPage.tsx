import React, { useState } from 'react';
import { User, Lock, Grid, Eye, EyeOff } from 'lucide-react';
import { InputField } from '../components/InputField';
import { useLoginMutation } from '../services/authApi';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setCredentials } from '../features/auth/authSlice';
import { storage } from '../utils/storage';
import loginBg from '../assets/home_Image.png';

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const [empEnroll, setEmpEnroll] = useState('');
  const [empPwd, setEmpPwd] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [login, { isLoading }] = useLoginMutation();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const enrollmentId = parseFloat(empEnroll);
    if (isNaN(enrollmentId)) {
      setErrorMsg('Invalid Enrollment ID.');
      return;
    }

    try {
      const result = await login({ empEnroll: enrollmentId, empPwd }).unwrap();

      if (result.statusCode === 1) {
        storage.setToken(result.token || '');
        storage.setUserName(result.empName);
        storage.setUserEnroll(result.empEnroll);
        storage.setMenuTree(result.menuTree);

        dispatch(setCredentials({
          token: result.token || '',
          empName: result.empName,
          empEnroll: result.empEnroll,
          menuTree: result.menuTree
        }));
        
        window.location.href = '/home';
      } else {
        setErrorMsg(result.message || 'Login failed.');
      }
    } catch (err: any) {
      if (err.data?.message) {
        setErrorMsg(err.data.message);
      } else {
        setErrorMsg('Server connection failed.');
      }
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen m-0 p-0 overflow-hidden select-none z-50 flex flex-col justify-between items-center">
      <img src={loginBg} alt="Background" className="absolute inset-0 w-full h-full object-cover object-center z-0" />
      <div className="absolute inset-0 bg-slate-900/5 backdrop-brightness-95 z-10" />
      <div />
      <div className="w-full max-w-[410px] bg-white/85 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl border border-white/50 relative z-20 text-center mx-auto my-auto">
        <div className="mx-auto w-11 h-11 bg-linear-to-br from-orange-500 to-orange-600 rounded-md flex items-center justify-center shadow-md mb-3 text-white">
          <Grid className="w-5 h-5 stroke-2" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-6">Sales And Distribution</h2>
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
          <InputField id="empEnroll" type="text" value={empEnroll} placeholder="Username" onChange={setEmpEnroll} icon={<User className="w-4 h-4" />} />
          <div className="relative flex items-center w-full">
            <InputField id="empPwd" type={showPassword ? 'text' : 'password'} value={empPwd} placeholder="Password" onChange={setEmpPwd} icon={<Lock className="w-4 h-4" />} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer z-30 focus:outline-none">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errorMsg && <div className="p-3 bg-red-50 text-xs font-semibold text-red-600 border border-red-200 rounded-md">{errorMsg}</div>}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 text-blue-600 border-slate-300 rounded-sm bg-white" />
              Remember username
            </label>
          </div>
          <button type="submit" disabled={isLoading} className="w-full mt-2 bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-700/60 font-bold py-2.5 rounded-md text-sm transition-all shadow-xs cursor-pointer active:scale-95">
            {isLoading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
      </div>
      <div className="w-full text-center relative z-20 text-[10px] sm:text-xs font-bold text-slate-700 max-w-4xl py-2 bg-white/30 backdrop-blur-sm rounded-md border border-white/20 shadow-xs mb-4">
        আটা | ময়দা | সুজি
      </div>
    </div>
  );
};