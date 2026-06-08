import React from 'react';

interface InputFieldProps {
  id: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
}

export const InputField: React.FC<InputFieldProps> = ({ id, type, value, placeholder, onChange, icon }) => {
  return (
    <div className="flex items-center border border-slate-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500 transition-all w-full">
      <div className="pl-3.5 text-slate-400 flex items-center justify-center">
        {icon}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden"
        required
      />
    </div>
  );
};