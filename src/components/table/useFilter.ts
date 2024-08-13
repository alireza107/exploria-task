import { useState } from 'react';

type FilterValue = string | RegExp;

export const useFilter = (initialData: any[]) => {
  const [filters, setFilters] = useState<{ [key: string]: FilterValue }>({});

  const onFilterChange = (columnKey: string, filterValue: FilterValue) => {
    setFilters({
      ...filters,
      [columnKey]: filterValue,
    });
  };

  const filteredData = initialData.filter((item) => {
    return Object.keys(filters).every((key) => {
      const filterValue = filters[key];
      const itemValue = item[key]?.toString().toLowerCase();

      if (typeof filterValue === 'string') {
        return itemValue.includes(filterValue.toLowerCase());
      }

      if (filterValue instanceof RegExp) {
        return filterValue.test(itemValue);
      }

      return true;
    });
  });

  return { filteredData, onFilterChange, filters };
};
