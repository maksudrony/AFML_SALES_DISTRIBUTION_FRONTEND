import { useEffect } from 'react';
import { useGetSalesChannelTypeQuery } from '../../services/salesChannelTypeApi';

interface SalesChannelTypeSelectProps {
  userId: string;
  value: number | '';
  onChange: (value: number | '') => void;
  onError: (errorMsg: string) => void;
}

export const SalesChannelTypeSelect = ({ userId, value, onChange, onError }: SalesChannelTypeSelectProps) => {
  const { data: salesChannelTypes = [], error } = useGetSalesChannelTypeQuery(
     userId ,
    { skip: !userId } 
  );

  useEffect(() => {
    if (error) { 
        onError("Opps! Failed to connect with server");
    }
  }, [error, onError]);

  return (
    <div className="w-full flex flex-col">
      <label 
        htmlFor="sales-channel-type-select" 
        className="text-[10px] font-bold text-slate-700 uppercase truncate"
      >
        Sales Channel Type
      </label>
      <select 
        id="sales-channel-type-select" 
        title="Select Sales Channel Type" 
        value={value} 
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')} 
        className="border border-slate-300 rounded-md px-1 text-[11px] font-semibold w-full 
        h-[30px] focus:outline-none focus:border-blue-500 bg-white disabled:bg-slate-50 
        disabled:text-slate-400 truncate box-border cursor-pointer">
        <option value="">--Select--</option>
        {salesChannelTypes.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
    </div>
  );
};