import React from 'react';

interface HomePageProps {
  empName: string;
  onLogout: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ empName, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 select-none">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-slate-200/80 max-w-md w-full text-center">
        
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto border border-emerald-100 shadow-xs mb-6">
          <span className="text-2xl font-black">✔</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
          Welcome To <span className="text-blue-600">Akij Flour Mills Sales & Distribution</span>
        </h1>

        <p className="text-sm font-semibold text-slate-600 mt-4">
          User: {empName}
        </p>

        <button 
          onClick={onLogout}
          className="mt-8 w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer active:scale-95"
        >
          Logout
        </button>
      </div>
    </div>
  );
};