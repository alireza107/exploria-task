import { useState } from 'react';

type SortOrder = 'asc' | 'desc';

interface SortConfig {
  key: string;
  order: SortOrder;
}

export const useSort = (initialData: any[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig[]>([]);

  const onSort = (columnKey: string) => {
    let newSortConfig = [...sortConfig];
    const existingSortIndex = newSortConfig.findIndex(
      (sort) => sort.key === columnKey
    );

    if (existingSortIndex >= 0) {
      if (newSortConfig[existingSortIndex].order === 'desc') {
        newSortConfig.splice(existingSortIndex, 1);
      } else {
        newSortConfig[existingSortIndex].order =
          newSortConfig[existingSortIndex].order === 'asc' ? 'desc' : 'asc';
      }
    } else {
      newSortConfig.push({ key: columnKey, order: 'asc' });
    }

    setSortConfig(newSortConfig);
  };

  const sortedData = [...initialData].sort((a, b) => {
    for (let i = 0; i < sortConfig.length; i++) {
      const { key, order } = sortConfig[i];
      if (a[key] < b[key]) {
        return order === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return order === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  return { sortedData, onSort, sortConfig };
};
