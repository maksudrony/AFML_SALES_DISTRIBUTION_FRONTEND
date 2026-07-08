import { useEffect } from 'react';
import { useGetProductCategoriesQuery } from '../../services/productCategoryApi';

interface ProductCategorySelectProps {
  value: string | number;
  onChange: (value: number | '') => void;
  onError: (errorMsg: string) => void;
}

export const ProductCategorySelect = ({ value, onChange, onError }: ProductCategorySelectProps) => {
  const { data: productCategories = [], error } = useGetProductCategoriesQuery();

  useEffect(() => {
    if (error) {
      onError("Failed to load product Categories");
    }
  }, [error, onError]);

  return (
    <div className="flex-1 w-full flex flex-col">
      <label htmlFor="product-category-select" className="text-[10px] font-bold text-slate-700 uppercase truncate">
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