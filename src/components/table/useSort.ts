import { useMemo } from 'react';

type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  order: SortOrder;
}

export const useSort = (initialData: any[], sortConfig: SortConfig | null) => {
  const sortedData = useMemo(() => {
    if (!sortConfig) return initialData;

    const { key, order } = sortConfig;
    return [...initialData].sort((a, b) => {
      if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [initialData, sortConfig]);

  const onSort = (key: string) => {
    if (sortConfig && sortConfig.key === key) {
      const newOrder = sortConfig.order === 'asc' ? 'desc' : 'asc';
      if (sortConfig.order === 'desc') {
        return null;
      } else {
        return { key, order: newOrder };
      }
    } else {
      return { key, order: 'asc' };
    }
  };

  return { sortedData, onSort };
};
