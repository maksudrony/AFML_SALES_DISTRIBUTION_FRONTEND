import { useEffect } from 'react';
import Select from 'react-select';
import { useGetChallanDistributorQuery } from '../../services/challanDistributorApi';

interface ChallanDistributorSelectProps {
  fromDate: string;
  toDate: string;
  channelId: number;
  userId: string;
  value: number;
  onChange: (value: number) => void;
  onError: (errorMsg: string) => void;
}

export const ChallanDistributorSelect = ({ fromDate, toDate, channelId, userId, value, onChange, onError }: ChallanDistributorSelectProps) => {
  const { data: challanDistributor = [], error } = useGetChallanDistributorQuery(
    { 
      fromDate, 
      toDate, 
      channelId: channelId === 0 ? null : channelId, 
      userId 
    }
  );

  useEffect(() => {
    if (error) onError("Opps! Failed to connect with server");
  }, [error, onError]);

  const options = [
    { value: 0, label: '-- All Distributors --' },
    ...challanDistributor.map(item => ({ value: item.id, label: item.name }))
  ];

  const currentValue = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="w-full flex flex-col relative z-50">
      <label 
        htmlFor="challan-distributor-select" 
        className="text-[10px] font-bold text-slate-700 uppercase truncate"
      >
        Distributor
      </label>

      <Select
        options={options}
        value={currentValue}
        onChange={(selected) => onChange(selected?.value ?? 0)}
        isSearchable={true}
        placeholder="Search product..."
        className="text-[11px] font-semibold w-full"
        styles={{
          control: (base) => ({
            ...base,
            //backgroundColor: 'transparent',
            height: '30px',
            minHeight: '30px',
            borderColor: '#cbd5e1',
            borderRadius: '0.375rem',
            boxShadow: 'none',
            display: 'flex',       
            alignItems: 'center',  
            flexWrap: 'nowrap',
            '&:hover': { borderColor: '#cbd5e1' }
          }),
          option: (base) => ({
            ...base,
            fontSize: '11px',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            padding: '6px',
          })
        }}
      />
    </div>
  );
};