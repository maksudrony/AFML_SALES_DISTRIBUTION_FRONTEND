import { useEffect } from 'react';
import { useGetTimeManagementQuery } from '../../services/timeManagementApi';

interface TimeManagementSelectProps {
  value:  number | '';
  onChange: (value: number | '') => void;
  onError: (errorMsg: string) => void;
  includeValues?: number[];
}

export const TimeManagementSelect = ({ value, onChange, onError, includeValues =[] }: TimeManagementSelectProps) => {
  const { data: TimeManagement = [], error } = useGetTimeManagementQuery();

  useEffect(() => {
    if (error) {
      onError("Failed to load Time Management");
    }
  }, [error, onError]);

  const filteredTimeManagement =  includeValues.length  
  ? TimeManagement.filter((item) => includeValues.includes(item.id))
  : TimeManagement;

  return (
    <div className="flex-1 w-full flex flex-col">
      <label 
        htmlFor="time-management-select" 
        className="text-[10px] font-bold text-slate-700 uppercase truncate"
      >
        Report Type
      </label>
      
      <select
        id="time-management-select"
        title="Select Time Management"
        value={value}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
        className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full 
        h-[28px] focus:outline-none focus:border-blue-500 bg-white truncate box-border"
      >
        <option value="">-- Select Time --</option>
        
        {filteredTimeManagement.map((item) => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </select>
    </div>
  );
};