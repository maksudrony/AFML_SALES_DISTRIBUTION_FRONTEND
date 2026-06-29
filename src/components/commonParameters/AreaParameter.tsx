import { useEffect } from 'react';
import { useGetAreasQuery } from '../../services/areaParameterApi';

interface AreaSelectProps {
  userId: string;
  divisionId: number | '';
  value: number | '';
  onChange: (value: number | '') => void;
  onError: (errorMsg: string) => void;
}

export const AreaSelect = ({ userId, divisionId, value, onChange, onError }: AreaSelectProps) => {
  const { data: areas = [], error } = useGetAreasQuery(
    { userId, divisionId: Number(divisionId) },
    { skip: !userId || !divisionId }
  );

  useEffect(() => {
    if (error) onError("Opps! Failed to connect with server");
  }, [error, onError]);

  return (
    <div className="w-full flex flex-col">
      <label htmlFor="area-select" className="text-[10px] font-bold text-slate-500 uppercase truncate">Area</label>
      <select 
        id="area-select" 
        title="Select Area" 
        value={value} 
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')} 
        disabled={!divisionId} 
        className="border border-slate-300 rounded-md px-1 text-[11px] font-semibold w-full 
        h-[30px] focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-50 
        disabled:text-slate-400 truncate box-border cursor-pointer">
        <option value="">--Select--</option>
        {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
      </select>
    </div>
  );
};