import { useEffect } from 'react';
import { useGetZonesQuery } from '../../services/zoneParameterApi';

interface ZoneSelectProps {
  userId: string;
  channelId: number | '';
  value: number | '';
  onChange: (value: number | '') => void;
  onError: (errorMsg: string) => void;
}

export const ZoneSelect = ({ userId, channelId, value, onChange, onError }: ZoneSelectProps) => {
  const { data: zones = [], error } = useGetZonesQuery(
    { userId, channelId: Number(channelId) },
    { skip: !userId || !channelId }
  );

  useEffect(() => {
    if (error) onError("Opps! Failed to connect with server");
  }, [error, onError]);

  return (
    <div className="w-full flex flex-col">
      <label htmlFor="zone-select" className="text-[10px] font-bold text-slate-700 uppercase truncate">Zone</label>
      <select 
        id="zone-select" 
        title="Select Zone" 
        value={value} 
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')} 
        disabled={!channelId} 
        className="border border-slate-300 rounded-md px-1 text-[11px] font-semibold w-full 
        h-[30px] focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-50 
        disabled:text-slate-400 truncate box-border cursor-pointer">
        <option value="">--Select--</option>
        {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
      </select>
    </div>
  );
};