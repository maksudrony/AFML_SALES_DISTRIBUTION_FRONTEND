import { useEffect } from 'react';
import { useGetQuantityTypeQuery } from '../../services/quantityTypeApi';

interface QuantityTypeSelectProps {
  value:  number;
  onChange: (value: number) => void;
  onError: (errorMsg: string) => void;
  includeValues?: number[];
}

export const QuantityTypeSelect = ({ value, onChange, onError, includeValues = [] }: QuantityTypeSelectProps) => {
  const { data: QuantityTypes = [], error } = useGetQuantityTypeQuery();

  useEffect(() => {
    if (error) {
      onError("Failed to load Quantity Types");
    }
  }, [error, onError]);

  const filteredQuantityTypes =  includeValues.length  
  ? QuantityTypes.filter((item) => includeValues.includes(item.id))
  : QuantityTypes;

  return (
    <div className="flex-1 w-full flex flex-col">
      <label 
        htmlFor="quantity-type-select" 
        className="text-[10px] font-bold text-slate-700 uppercase truncate"
      >
        Quantity Type
      </label>
      
      <select
        id="quantity-type-select"
        title="Select Quantity Type"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full 
        h-[28px] focus:outline-none focus:border-blue-500 bg-white truncate box-border"
      >
        <option value={0}>-- All Types --</option>
        {filteredQuantityTypes.map((item) => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </select>
    </div>
  );
};