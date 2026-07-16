import { useEffect } from 'react';
import { useGetReportTypeQuery } from '../../services/reportTypeApi';

interface ReportTypeSelectProps {
  value:  number;
  onChange: (value: number) => void;
  onError: (errorMsg: string) => void;
  includeValues?: number[];
}

export const ReportTypeSelect = ({ value, onChange, onError, includeValues =[] }: ReportTypeSelectProps) => {
  const { data: ReportTypes = [], error } = useGetReportTypeQuery();

  useEffect(() => {
    if (error) {
      onError("Failed to load Report Types");
    }
  }, [error, onError]);

  const filteredReportTypes =  includeValues.length  
  ? ReportTypes.filter((item) => includeValues.includes(item.id))
  : ReportTypes;

  return (
    <div className="flex-1 w-full flex flex-col">
      <label 
        htmlFor="report-type-select" 
        className="text-[10px] font-bold text-slate-700 uppercase truncate"
      >
        Report Type
      </label>
      
      <select
        id="report-type-select"
        title="Select Report Type"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full 
        h-[28px] focus:outline-none focus:border-blue-500 bg-white truncate box-border"
      >
        <option value={0}>-- All Types --</option>
        
        {filteredReportTypes.map((item) => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </select>
    </div>
  );
};