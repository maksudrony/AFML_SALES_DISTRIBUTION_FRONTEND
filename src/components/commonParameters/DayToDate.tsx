import React from 'react';

interface DayToDateProps {
  dayToDate: string;
  onDayToDateChange: (date: string) => void;
}

export const DayToDateSelect = ({dayToDate,onDayToDateChange}: DayToDateProps) => {
  return (
    <>
    {/* <div className="flex flex-row items-center gap-2 w-full sm:w-auto"> */}
      {/* From Date */}
      <div className="w-full flex flex-col">
        <label htmlFor="common-from-date" className="text-[10px] font-bold text-slate-700 uppercase truncate">
          Day From Date
        </label>
        <input 
          id="common-from-date"
          type="date" 
          value={dayToDate} 
          onChange={(e) => onDayToDateChange(e.target.value)}
          className="border border-slate-300 rounded-md px-2 text-[11px] font-semibold w-full 
          h-[30px] focus:outline-none focus:border-blue-500 bg-slate-50/50 box-border"
        />
      </div>
    </>
  );
};