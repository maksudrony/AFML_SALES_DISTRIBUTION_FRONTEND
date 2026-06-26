import React from 'react';

interface CommonDateRangeProps {
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
}

export const CommonDateRange = ({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange
}: CommonDateRangeProps) => {
  return (
    <>
    {/* <div className="flex flex-row items-center gap-2 w-full sm:w-auto"> */}
      {/* From Date */}
      <div className="w-full flex flex-col">
        <label htmlFor="common-from-date" className="text-[10px] font-bold text-slate-500 uppercase truncate">
          From Date
        </label>
        <input 
          id="common-from-date"
          type="date" 
          value={fromDate} 
          onChange={(e) => onFromDateChange(e.target.value)}
          className="border border-slate-300 rounded-md px-2 text-[11px] font-semibold w-full 
          h-[30px] focus:outline-none focus:border-blue-500 bg-slate-50/50 box-border"
        />
      </div>

      {/* To Date */}
      <div className="w-full flex flex-col">
        <label htmlFor="common-to-date" className="text-[10px] font-bold text-slate-500 uppercase truncate">
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