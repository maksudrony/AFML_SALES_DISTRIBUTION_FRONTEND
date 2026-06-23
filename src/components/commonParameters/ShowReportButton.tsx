import React from 'react';
import { RefreshCw, CircleArrowRight } from 'lucide-react';

interface ShowReportButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export const ShowReportButton = ({
  onClick,
  disabled,
  isLoading
}: ShowReportButtonProps) => {
  return (
    <div className="flex-1 min-w-[120px] sm:min-w-0 w-full">
      <button 
        type="button"
        onClick={onClick} 
        disabled={disabled || isLoading}
        className="w-full flex items-center justify-center gap-1 h-[28px] text-white font-bold text-[10px] rounded-md shadow-md cursor-pointer transition-all active:scale-95 disabled:bg-slate-400 bg-[#D91656] hover:bg-[#b51246] show-report"
      >
        <span>SHOW REPORT</span>
        {isLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CircleArrowRight className="w-4 h-4" />}
      </button>
    </div>
  );
};