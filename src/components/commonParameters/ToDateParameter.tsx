import React from 'react';

interface ToDateProps {
  toDate: string;
  onToDateChange: (date: string) => void;
}

export const ToDateSelect = ({
  toDate,
  onToDateChange
}: ToDateProps) => {
  return (
    <>
    {/* <div className="flex flex-row items-center gap-2 w-full sm:w-auto"> */}
      {/* To Date */}
      <div className="w-full flex flex-col">
        <label htmlFor="common-to-date" className="text-[10px] font-bold text-slate-700 uppercase truncate">
          To Date
        </label>
        <input 
          id="common-to-date"
          type="date" 
          value={toDate} 
          onChange={(e) => onToDateChange(e.target.value)}
          className="border border-slate-300 rounded-md px-2 text-[11px] font-semibold w-full 
          h-[30px] focus:outline-none focus:border-blue-500 bg-slate-50/50 box-border"
        />
      </div>
    {/* </div> */}
    </>
  );
};