import { useEffect } from 'react';
import { useGetTerritoriesQuery } from '../../services/territoryParameterApi';

interface TerritorySelectProps {
  userId: string;
  areaId: number | '';
  value: number | '';
  onChange: (value: number | '') => void;
  onError: (errorMsg: string) => void;
}

export const TerritorySelect = ({ userId, areaId, value, onChange, onError }: TerritorySelectProps) => {
  const { data: territories = [], error } = useGetTerritoriesQuery(
    { userId, areaId: Number(areaId) },
    { skip: !userId || !areaId }
  );

  useEffect(() => {
    if (error) onError("Opps! Failed to connect with server");
  }, [error, onError]);

  return (
    <div className="w-full flex flex-col">
      <label htmlFor="territory-select" className="text-[10px] font-bold text-slate-700 uppercase truncate">Territory</label>
      <select 
        id="territory-select" 
        title="Select Territory" 
        value={value} 
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')} 
        disabled={!areaId} 
        className="border border-slate-300 rounded-md px-1 text-[11px] font-semibold w-full 
        h-[30px] focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-50 
        disabled:text-slate-400 truncate box-border cursor-pointer">
        <option value="">--Select--</option>
        {territories.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
    </div>
  );
};