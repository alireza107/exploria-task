import { useState } from 'react';

export const useFilter = (initialData: any[]) => {
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  const onFilterChange = (columnKey: string, filterValue: string) => {
    setFilters({
      ...filters,
      [columnKey]: filterValue,
    });
  };

  const filteredData = initialData.filter((item) => {
    return Object.keys(filters).every((key) =>
      item[key]
        .toString()
        .toLowerCase()
        .includes(filters[key]?.toLowerCase() || '')
    );
  });

  return { filteredData, onFilterChange, filters };
};
