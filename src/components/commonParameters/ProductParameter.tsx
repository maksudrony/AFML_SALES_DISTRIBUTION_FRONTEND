import { useEffect } from 'react';
import Select from 'react-select';
import { useGetProductDetailsQuery } from '../../services/productParameterApi';

interface ProductParameterSelectProps {
  value: number;
  onChange: (value: number) => void;
  onError: (errorMsg: string) => void;
}

export const ProductParameterSelect = ({ value, onChange, onError }: ProductParameterSelectProps) => {
  const { data: product = [], error } = useGetProductDetailsQuery();

  useEffect(() => {
    if (error) {
      onError("Failed to load products");
    }
  }, [error, onError]);

  const options = [
    { value: 0, label: '-- All Products --' },
    ...product.map(item => ({ value: item.id, label: item.name }))
  ];

  const currentValue = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="w-full flex flex-col relative z-50">
      <label className="text-[10px] font-bold text-slate-700 uppercase truncate">
        Product
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
            fontSize: '10px',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            padding: '6px',
          })
        }}
      />
    </div>
  );
};