import { useEffect } from 'react';
import Select from 'react-select';
import { useGetZonesQuery } from '../../services/zoneParameterApi';

interface ZoneSelectProps {
  userId: string;
  channelId: number;
  value: number;
  onChange: (value: number) => void;
  onError: (errorMsg: string) => void;
}

export const ZoneSelect = ({ userId, channelId, value, onChange, onError,}: ZoneSelectProps) => {
  const { data: zones = [], error } = useGetZonesQuery(
    { userId, channelId },
    { skip: channelId === 0 }
  );

  useEffect(() => {
    if (error) onError('Opps! Failed to connect with server');
  }, [error, onError]);

  const options = [
    { value: 0, label: '-- Select Zone --' },
    ...zones.map((item) => ({
      value: item.id,
      label: item.name,
    })),
  ];

  const currentValue =
    options.find((option) => option.value === value) || options[0];

  return (
    <div className="w-full flex flex-col">
      <label
        htmlFor="zone-select"
        className="text-[10px] font-bold text-slate-700 uppercase truncate"
      >
        Zone
      </label>

      <Select
        inputId="zone-select"
        options={options}
        value={currentValue}
        onChange={(selected) => onChange(selected?.value ?? 0)}
        isSearchable={true}
        isDisabled={!channelId}
        placeholder="Search zone..."
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
            backgroundColor: !channelId ? '#f8fafc' : '#fff',
            '&:hover': {
              borderColor: '#cbd5e1',
            },
          }),

          valueContainer: (base) => ({
            ...base,
            height: '30px',
            padding: '0 8px',
          }),

          input: (base) => ({
            ...base,
            margin: 0,
            padding: 0,
          }),

          singleValue: (base) => ({
            ...base,
            fontSize: '11px',
          }),

          option: (base) => ({
            ...base,
            fontSize: '11px',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            padding: '6px',
          }),

          menu: (base) => ({
            ...base,
            zIndex: 35,
          })
        }}
      />
    </div>
  );
};