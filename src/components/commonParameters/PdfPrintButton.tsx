import React from 'react';
import { Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

interface PdfPrintButtonProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
  hasData: boolean;
  documentTitle: string;
  orientation: 'portrait' | 'landscape';
  onError: (msg: string) => void;
}

export const PdfPrintButton = ({
  contentRef,
  hasData,
  documentTitle,
  orientation,
  onError
}: PdfPrintButtonProps) => {

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: documentTitle,
    onBeforePrint: async () => {
      document.documentElement.style.setProperty('--print-orientation', orientation);
    },
    onAfterPrint: () => {
      document.documentElement.style.setProperty('--print-orientation', 'portrait');

      //alert("PDF Successfully Saved!");
    }
  });

  const onClickHandler = () => {
    if (!hasData) {
      onError("Opps! please click show report At first before printing");
      return;
    }
    if (!contentRef.current) {
      onError("Error: Report content element ref reference not found");
      return;
    }

    //console.log(contentRef.current);
    handlePrint();
  };

  return (
    <div className="w-full">
      <button 
        type="button"
        onClick={onClickHandler}
        className="flex items-center justify-center w-full h-[30px] gap-1.5 px-4 bg-blue-600 
        hover:bg-blue-700 text-white font-bold text-[10px] tracking-wider rounded-md 
        shadow-sm cursor-pointer transition-colors whitespace-nowrap !flex-nowrap text-ellipsis 
        overflow-hidden"
      >
        <span className="flex-shrink-0">PDF</span> 
        <Printer className="w-3.5 h-3.5 flex-shrink-0" />
      </button> 
    </div>
  );
};