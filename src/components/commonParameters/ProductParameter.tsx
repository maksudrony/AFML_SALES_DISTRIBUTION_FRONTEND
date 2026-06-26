import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { apiClient } from '../../api/apiClient'; 
import type { ICommonParameterDto } from '../../types/commonParameters';

interface ProductParameterSelectProps {
  value: string | number;
  onChange: (value: number | '') => void;
  onError: (errorMsg: string) => void;
}

export const ProductParameterSelect = ({ value, onChange, onError }: ProductParameterSelectProps) => {
  const [product, setProduct] = useState<ICommonParameterDto[]>([]);

  useEffect(() => {
    apiClient.get<ICommonParameterDto[]>('/CommonParameters/product-detail')  
      .then((res) => setProduct(res.data))
      .catch((err: unknown) => {
        if (err && typeof err === 'object' && 'response' in err) {
          const responseObj = (err as any).response;
          if (responseObj && responseObj.data) {
            onError(responseObj.data.error || "Failed to load products.");
          }
        }
      });
  }, [onError]);

  const options = [
    { value: '', label: '-- All Products --' },
    ...product.map(item => ({ value: item.id, label: item.name }))
  ];

  const currentValue = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="w-full flex flex-col">
      <label className="text-[10px] font-bold text-slate-500 uppercase truncate">
        Product
      </label>
      
      {/* 🚀 Super Shortest Approach with React-Select Built-in Styles */}
      <Select
        options={options}
        value={currentValue}
        onChange={(selected) => onChange(selected ? (selected.value as number | '') : '')}
        isSearchable={true}
        placeholder="Search product..."
        className="text-[11px] font-semibold w-full"
        
        // Pure CSS layer style optimization overrides
        styles={{
          control: (base) => ({
            ...base,
            height: '30px',
            minHeight: '30px',
            borderColor: '#cbd5e1', // border-slate-300
            borderRadius: '0.375rem', // rounded-md
            boxShadow: 'none',
            display: 'flex',       // Text center align automatic kaj korbe
            alignItems: 'center',  // Strictly centers text vertically
            flexWrap: 'nowrap',
            '&:hover': { borderColor: '#cbd5e1' }
          }),
          // Dropdown open list matrix context auto-break system constraint rule logic!
          option: (base) => ({
            ...base,
            fontSize: '10px',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            padding: '6px'
          })
        }}
      />
    </div>
  );
};