import { useEffect } from 'react';
import Select from 'react-select';
import { useGetTimeManagementQuery } from '../../services/timeManagementApi';

interface FromTimeProps {
  fromTime: number;
  onFromTimeChange: (value: number) => void;
  onError: (errorMsg: string) => void;
}

export const FromTimeSelect = ({fromTime, onFromTimeChange, onError,}: FromTimeProps) => {
  const { data: fromTimeData = [], error } = useGetTimeManagementQuery();

  useEffect(() => {
    if (error) {
      onError('Failed to load Time Management');
    }
  }, [error, onError]);

  const options = [
    ...fromTimeData.map(item => ({ value: item.id, label: item.name }))
  ];

  const currentValue = options.find(opt => opt.value === fromTime) ?? null;

  return (
    <>
      {/* From Time */}
      <div className="w-full flex flex-col relative z-50">
        <label
          htmlFor="from-time"
          className="text-[10px] font-bold text-slate-700 uppercase truncate"
        >
          From Time
        </label>

      <Select
        options={options}
        value={currentValue}
        onChange={(selected) => {
          if (selected) {
            onFromTimeChange(selected.value as number)
          }
        }} 
        isSearchable={true}
        placeholder="Search product..."
        className="text-[11px] font-semibold w-full"
        styles={{
          control: (base) => ({
            ...base,
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

    </>
  );
};