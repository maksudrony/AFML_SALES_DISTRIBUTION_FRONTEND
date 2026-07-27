import React from 'react';
import { Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

interface DashboardPdfButtonProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
  hasData: boolean;
  documentTitle: string;
  onError: (msg: string) => void;
}

export const DashboardPdfButton = ({
  contentRef,
  hasData,
  documentTitle,
  onError,
}: DashboardPdfButtonProps) => {

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle,

    onBeforePrint: async () => {
      document.documentElement.classList.add(
        'sales-dashboard-print-mode'
      );
    },

    onAfterPrint: () => {
      document.documentElement.classList.remove(
        'sales-dashboard-print-mode'
      );
    },
  });

  const onClickHandler = () => {

    if (!hasData) {
      onError(
        'Oops! Please load the dashboard data before printing.'
      );
      return;
    }

    if (!contentRef.current) {
      onError(
        'Error: Dashboard print content reference not found.'
      );
      return;
    }

    handlePrint();
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onClickHandler}
        className="
          flex items-center justify-center
          w-full h-[30px]
          gap-1.5 px-4
          bg-gradient-to-r from-sky-600 via-purple-500 to-pink-400
          hover:from-sky-700 hover:via-purple-600 hover:to-pink-500
          hover:shadow-xl
          text-white font-bold text-[10px]
          tracking-wider rounded-md
          cursor-pointer transition-colors
          whitespace-nowrap
        "
      >
        <span>PDF</span>

        <Printer className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};