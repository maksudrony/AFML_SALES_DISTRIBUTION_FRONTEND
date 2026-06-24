import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/apiClient'; 
import type { ICommonParameterDto } from '../../types/commonParameters';

interface ProductParameterSelectProps {
  value: string | number;
  onChange: (value: number | '') => void;
  onError: (errorMsg: string) => void;
}

export const ProductParameterSelect =({value,onChange,onError} : ProductParameterSelectProps)=>{

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

  return (
  <div className="flex-1 w-full flex flex-col gap-1">
    <label htmlFor="product-select" className="text-[10px] font-bold text-slate-500 uppercase truncate">
      Product
    </label>
    
    <select
      id="product-select"
      title="Select Product"
      value={value}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
      className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full h-[28px] focus:outline-none focus:border-blue-500 bg-white truncate box-border"
    >
      <option value="">-- All Products --</option>
      {product.map((item) => (
        <option key={item.id} value={item.id}>{item.name}</option>
      ))}
    </select>
  </div>
  )
}