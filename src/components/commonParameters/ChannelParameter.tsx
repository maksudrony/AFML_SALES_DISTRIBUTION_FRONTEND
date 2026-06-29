import { useEffect } from 'react';
import { useGetChannelsQuery } from '../../services/channelParameterApi';

interface ChannelSelectProps {
  userId: string;
  value: number | '';
  onChange: (value: number | '') => void;
  onError: (errorMsg: string) => void;
  onlyConsumer?: boolean;
}

export const ChannelSelect = ({ userId, value, onChange, onError, onlyConsumer = false }: ChannelSelectProps) => {
  const { data: rawChannels = [], error } = useGetChannelsQuery(userId, { skip: !userId });

  useEffect(() => {
    if (error) onError("Opps! Failed to connect with server");
  }, [error, onError]);

  const channels = onlyConsumer
    ? rawChannels.filter(c => c.id === 1 || c.name?.toLowerCase() === 'consumer')
    : rawChannels;

  return (
    <div className="w-full flex flex-col">
      <label htmlFor="channel-select" className="text-[10px] font-bold text-slate-500 uppercase truncate">Channel</label>
      <select 
        id="channel-select" 
        title="Select Channel" 
        value={value} 
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')} 
        className="border border-slate-300 rounded-md px-1 text-[11px] font-semibold w-full h-[30px] 
        focus:outline-none focus:border-blue-500 bg-white truncate box-border cursor-pointer">
        <option value="">--Select--</option>
        {channels.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
    </div>
  );
};