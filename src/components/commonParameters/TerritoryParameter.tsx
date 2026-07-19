import { useEffect } from 'react';
import Select from 'react-select';
import { useGetTerritoriesQuery } from '../../services/territoryParameterApi';

interface TerritorySelectProps {
  userId: string;
  areaId: number;
  value: number;
  onChange: (value: number) => void;
  onError: (errorMsg: string) => void;
}

export const TerritorySelect = ({ userId, areaId, value, onChange, onError,}: TerritorySelectProps) => {
  const { data: territories = [], error } = useGetTerritoriesQuery(
    { userId, areaId },
    { skip: areaId === 0 }
  );

  useEffect(() => {
    if (error) onError('Opps! Failed to connect with server');
  }, [error, onError]);

  const options = [
    { value: 0, label: '-- Select Territory --' },
    ...territories.map((item) => ({
      value: item.id,
      label: item.name,
    })),
  ];

  const currentValue =
    options.find((option) => option.value === value) || options[0];

  return (
    <div className="w-full flex flex-col">
      <label
        htmlFor="territory-select"
        className="text-[10px] font-bold text-slate-700 uppercase truncate"
      >
        Territory
      </label>

      <Select
        inputId="territory-select"
        options={options}
        value={currentValue}
        onChange={(selected) => onChange(selected?.value ?? 0)}
        isSearchable={true}
        isDisabled={!areaId}
        placeholder="Search territory..."
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
            backgroundColor: !areaId ? '#f8fafc' : '#fff',
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
          }),
        }}
      />
    </div>
  );
};