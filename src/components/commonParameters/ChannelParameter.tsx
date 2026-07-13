import { useEffect } from 'react';
import { useGetChannelsQuery } from '../../services/channelParameterApi';

interface ChannelSelectProps {
  userId: string;
  value: number | '';
  onChange: (value: number | '') => void;
  onError: (errorMsg: string) => void;
  includeValues?: number[];
}

export const ChannelSelect = ({ userId, value, onChange, onError,  includeValues = [] }: ChannelSelectProps) => {
  const { data: rawChannels = [], error } = useGetChannelsQuery(userId, { skip: !userId });

  useEffect(() => {
    if (error) onError("Opps! Failed to connect with server");
  }, [error, onError]);

  const filteredChannels =  includeValues.length  
  ? rawChannels.filter((item) => includeValues.includes(item.id))
  : rawChannels;

  return (
    <div className="w-full flex flex-col">
      <label htmlFor="channel-select" className="text-[10px] font-bold text-slate-700 uppercase truncate">Channel</label>
      <select 
        id="channel-select" 
        title="Select Channel" 
        value={value} 
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')} 
        className="border border-slate-300 rounded-md px-1 text-[11px] font-semibold w-full h-[30px] 
        focus:outline-none focus:border-blue-500 bg-white truncate box-border cursor-pointer">
        <option value="">--Select--</option>
        {filteredChannels.map((item) => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </select>
    </div>
  );
};