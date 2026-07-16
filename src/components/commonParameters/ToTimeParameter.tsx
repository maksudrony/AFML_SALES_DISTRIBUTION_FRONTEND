import { useEffect } from 'react';
import Select from 'react-select';
import { useGetTimeManagementQuery } from '../../services/timeManagementApi';

interface ToTimeProps {
  toTime: number;
  onToTimeChange: (value: number) => void;
  onError: (errorMsg: string) => void;
}

export const ToTimeSelect = ({toTime, onToTimeChange, onError,}: ToTimeProps) => {
  const { data: toTimeData = [], error } = useGetTimeManagementQuery();

  useEffect(() => {
    if (error) {
      onError('Failed to load Time Management');
    }
  }, [error, onError]);

  const options = [
    ...toTimeData.map(item => ({ value: item.id, label: item.name }))
  ];

  const currentValue = options.find(opt => opt.value === toTime) ?? null;

  return (
    <>
      {/* To Time */}
      <div className="w-full flex flex-col relative z-50">
        <label
          htmlFor="to-time"
          className="text-[10px] font-bold text-slate-700 uppercase truncate"
        >
          To Time
        </label>

      <Select
        options={options}
        value={currentValue}
        onChange={(selected) => {
          if (selected) {
            onToTimeChange(selected.value as number)
          }
        }} 
        isSearchable={true}
        placeholder="Select Time"
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