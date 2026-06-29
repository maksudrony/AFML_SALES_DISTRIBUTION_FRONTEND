import { useEffect } from 'react';
import { useGetDivisionsQuery } from '../../services/divisionParameterApi';

interface DivisionSelectProps {
  userId: string;
  zoneId: number | '';
  value: number | '';
  onChange: (value: number | '') => void;
  onError: (errorMsg: string) => void;
}

export const DivisionSelect = ({ userId, zoneId, value, onChange, onError }: DivisionSelectProps) => {
  const { data: divisions = [], error } = useGetDivisionsQuery(
    { userId, zoneId: Number(zoneId) },
    { skip: !userId || !zoneId }
  );

  useEffect(() => {
    if (error) onError("Opps! Failed to connect with server");
  }, [error, onError]);

  return (
    <div className="w-full flex flex-col">
      <label htmlFor="division-select" className="text-[10px] font-bold text-slate-500 uppercase truncate">Division</label>
      <select 
        id="division-select" 
        title="Select Division" 
        value={value} 
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')} 
        disabled={!zoneId} 
        className="border border-slate-300 rounded-md px-1 text-[11px] font-semibold w-full 
        h-[30px] focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-50 
        disabled:text-slate-400 truncate box-border cursor-pointer">
        <option value="">--Select--</option>
        {divisions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>
    </div>
  );
};