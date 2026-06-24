import React from 'react';
import { RefreshCw, CircleArrowRight } from 'lucide-react';

interface ShowReportButtonProps {
  onClick: () => void;
  buttonAnimate: boolean;
  isLoading: boolean;
}

export const ShowReportButton = ({
  onClick,
  buttonAnimate,
  isLoading
}: ShowReportButtonProps) => {
  return (
    <div className="flex-1 min-w-[120px] sm:min-w-0 w-full">
      <button 
        type="button"
        onClick={onClick} 
        className={`
          w-full h-[28px] relative overflow-hidden rounded-md
          flex items-center justify-center gap-1
          text-white font-bold text-[10px]
          shadow-md cursor-pointer transition-all active:scale-95
          ${(buttonAnimate || isLoading)
            ? "bg-gradient-to-r from-indigo-500 via-pink-500 via-cyan-500 to-emerald-500 bg-[length:300%_100%] animate-gradient"
            : "bg-[#D91656] hover:bg-[#b51246]"
          }
        `}
      >
        <span className="relative z-10">
          SHOW REPORT
        </span>

        {isLoading 
          ? <RefreshCw className="relative z-10 w-4 h-4 animate-spin" /> 
          : <CircleArrowRight className="relative z-10 w-4 h-4" />
        }
      </button>
    </div>
  );
};