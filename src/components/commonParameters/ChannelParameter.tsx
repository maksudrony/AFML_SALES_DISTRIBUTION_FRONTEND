import { useEffect } from 'react';
import Select from 'react-select';
import { useGetChannelsQuery } from '../../services/channelParameterApi';

interface ChannelSelectProps {
  userId: string;
  value: number;
  onChange: (value: number) => void;
  onError: (errorMsg: string) => void;
  includeValues?: number[];
}

export const ChannelSelect = ({userId, value, onChange, onError, includeValues = [], }: ChannelSelectProps) => {
  const { data: rawChannels = [], error } = useGetChannelsQuery({ userId });

  useEffect(() => {
    if (error) onError('Opps! Failed to connect with server');
  }, [error, onError]);

  const filteredChannels = includeValues.length > 0
      ? rawChannels.filter((item) => includeValues.includes(item.id))
      : rawChannels;

  const options = [
    { value: 0, label: '-- Select Channel --' },
    ...filteredChannels.map((item) => ({
      value: item.id,
      label: item.name,
    })),
  ];

  const currentValue =
    options.find((option) => option.value === value) || options[0];

  return (
    <div className="w-full flex flex-col">
      <label
        htmlFor="channel-select"
        className="text-[10px] font-bold text-slate-700 uppercase truncate"
      >
        Channel
      </label>

      <Select
        inputId="channel-select"
        options={options}
        value={currentValue}
        onChange={(selected) => onChange(selected?.value ?? 0)}
        isSearchable={true}
        placeholder="Search channel..."
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
        //menuPortalTarget={document.body}
      />
    </div>
  );
};