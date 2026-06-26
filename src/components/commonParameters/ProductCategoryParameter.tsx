import { useState, useEffect } from 'react';
import { apiClient } from '../../api/apiClient';
import type { ICommonParameterDto } from '../../types/commonParameters';

interface ProductCategorySelectProps {
  value: string | number;
  onChange: (value: any) => void;
  onError: (errorMsg: string) => void;
}

export const ProductCategorySelect = ({
  value,
  onChange,
  onError
}: ProductCategorySelectProps) => {
  const [productCategories, setProductCategories] = useState<ICommonParameterDto[]>([]);

  useEffect(() => {
    apiClient.get<ICommonParameterDto[]>('/CommonParameters/product-categories')
      .then((res) => setProductCategories(res.data))
      .catch((err: unknown) => {
        if (err && typeof err === 'object' && 'response' in err) {
          const responseObj = (err as any).response;
          
          if (responseObj && responseObj.data) {
            const apiErrorMsg = responseObj.data.error || JSON.stringify(responseObj.data);
            
            // Connection timeout check
            if (apiErrorMsg && apiErrorMsg.includes("Connection request timed out")) {
              onError("Opps! Failed to connect with server");
            } else {
              onError("Failed to load product Categories");
            }
            return;
          }
        }
        // 👇 Direct network or server crash fallback
        onError("Opps! Failed to connect with server");
      });
  }, [onError]);

  return (
    <div className="flex-1 w-full flex flex-col">
      <label htmlFor="product-category-select" className="text-[10px] font-bold text-slate-500 uppercase truncate">
        Product Category
      </label>
      
      <select
        id="product-category-select"
        title="Select Product Category"
        value={value}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
        className="border border-slate-300 rounded-md p-1 text-[11px] font-semibold w-full 
        h-[28px] focus:outline-none focus:border-blue-500 bg-white truncate box-border"
      >
        <option value="">-- All Categories --</option>
        {productCategories.map((item) => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </select>
    </div>
  );
};