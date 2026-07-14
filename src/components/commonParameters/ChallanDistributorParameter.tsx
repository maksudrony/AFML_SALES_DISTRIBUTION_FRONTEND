import { useEffect } from 'react';
import { useGetChallanDistributorQuery } from '../../services/challanDistributorApi';

interface ChallanDistributorSelectProps {
  fromDate: string;
  toDate: string;
  channelId: number;
  userId: string;
  value: number | '';
  onChange: (value: number | '') => void;
  onError: (errorMsg: string) => void;
}

export const ChallanDistributorSelect = ({ fromDate, toDate, channelId, userId, value, onChange, onError }: ChallanDistributorSelectProps) => {
  const { data: challanDistributor = [], error } = useGetChallanDistributorQuery({ fromDate, toDate, channelId, userId });

  useEffect(() => {
    if (error) onError("Opps! Failed to connect with server");
  }, [error, onError]);

  return (
    <div className="w-full flex flex-col">
      <label htmlFor="challan-distributor-select" className="text-[10px] font-bold text-slate-700 uppercase truncate">Zone</label>
      <select 
        id="challan-distributor-select" 
        title="Select Challan Distributor" 
        value={value} 
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')} 
        className="border border-slate-300 rounded-md px-1 text-[11px] font-semibold w-full 
        h-[30px] focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-50 
        disabled:text-slate-400 truncate box-border cursor-pointer">
        <option value="">--Select--</option>
        {challanDistributor.map((z) => (
            <option key={z.id} value={z.id}>{z.name}</option>
        ))}
      </select>
    </div>
  );
};