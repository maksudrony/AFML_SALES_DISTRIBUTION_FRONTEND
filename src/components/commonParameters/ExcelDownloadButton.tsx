import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

interface ExcelDownloadButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export const ExcelDownloadButton = ({
  onClick,
  disabled = false
}: ExcelDownloadButtonProps) => {
  return (
    <div className="min-w-[120px] text-right">
      <button 
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-md shadow-sm cursor-pointer transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
      >
        <span>EXCEL DOWNLOAD</span> 
        <FileSpreadsheet className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};