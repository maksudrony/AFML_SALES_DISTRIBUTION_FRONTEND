import { useEffect } from 'react';
import { useGetTimeManagementQuery } from '../../services/timeManagementApi';

interface CommonTimeRangeProps {
  fromTime: number | '';
  toTime: number | '';
  onFromTimeChange: (value: number | '') => void;
  onToTimeChange: (value: number | '') => void;
  onError: (errorMsg: string) => void;
}

export const CommonTimeRange = ({fromTime, toTime, onFromTimeChange, onToTimeChange, onError,}: CommonTimeRangeProps) => {
  const { data: timeManagement = [], error } = useGetTimeManagementQuery();

  useEffect(() => {
    if (error) {
      onError('Failed to load Time Management');
    }
  }, [error, onError]);

  return (
    <>
      {/* From Time */}
      <div className="w-full flex flex-col">
        <label
          htmlFor="from-time"
          className="text-[10px] font-bold text-slate-700 uppercase truncate"
        >
          From Time
        </label>

        <select
          id="from-time"
          value={fromTime}
          onChange={(e) =>
            onFromTimeChange(e.target.value ? Number(e.target.value) : '')
          }
          className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full
          h-[28px] focus:outline-none focus:border-blue-500 bg-white box-border"
        >
          <option value="">-- Select Time --</option>

          {timeManagement.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* To Time */}
      <div className="w-full flex flex-col">
        <label
          htmlFor="to-time"
          className="text-[10px] font-bold text-slate-700 uppercase truncate"
        >
          To Time
        </label>

        <select
          id="to-time"
          value={toTime}
          onChange={(e) =>
            onToTimeChange(e.target.value ? Number(e.target.value) : '')
          }
          className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full
          h-[28px] focus:outline-none focus:border-blue-500 bg-white box-border"
        >
          <option value="">-- Select Time --</option>

          {timeManagement.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};