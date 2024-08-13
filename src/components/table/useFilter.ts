import { useMemo } from 'react';

type FilterValue = string | RegExp;

export const useFilter = (
  initialData: any[],
  filters: { [key: string]: FilterValue }
) => {
  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
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
  }, [initialData, filters]);

  return { filteredData };
};
