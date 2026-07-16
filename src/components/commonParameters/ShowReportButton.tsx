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
    <div className="w-full">
      <button 
        type="button"
        onClick={onClick} 
        className={`
          w-full h-[30px] rounded-md
          flex items-center justify-center gap-1.5 px-4
          text-white font-bold text-[10px] tracking-wider
          shadow-sm cursor-pointer transition-all active:scale-95 whitespace-nowrap 
          !flex-nowrap text-ellipsis overflow-hidden
          ${(buttonAnimate || isLoading)
            ? "bg-gradient-to-r from-indigo-500 via-pink-500 via-cyan-500 to-emerald-500 bg-[length:300%_100%] animate-gradient"
            : 
            "bg-gradient-to-r from-orange-500 via-pink-500 to-rose-400 hover:from-orange-600 hover:via-pink-600 hover:to-rose-500 hover:shadow-xl"
          }
        `}
      >
        <span className="flex-shrink-0">SHOW REPORT</span>
        {isLoading 
          ? <RefreshCw className="w-3.5 h-3.5 animate-spin flex-shrink-0" /> 
          : <CircleArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
        }
      </button>
    </div>
  );
};
