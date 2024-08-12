'use client';

import { TableProps } from './table.types';
import './table.css';
import { useMemo, useState } from 'react';

export const Table: React.FC<TableProps> = ({ columns, rows }: TableProps) => {
  const [sortConfigs, setSortConfigs] = useState<
    {
      key: string;
      direction: 'ascending' | 'descending';
    }[]
  >([]);

  const sortedRows = useMemo(() => {
    let sortedData = [...rows];
    sortConfigs.map((sortConfig) => {
      sortedData = sortedData.sort((a, b) => {
        const { key, direction } = sortConfig;
        if (a[key] < b[key]) {
          return direction === 'ascending' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    });

    return sortedData;
  }, [rows, sortConfigs]);

  const requestSort = (key: string) => {
    setSortConfigs((prevConfigs) => {
      const existingConfigIndex = prevConfigs.findIndex(
        (config) => config.key === key
      );
      if (existingConfigIndex > -1) {
        const existingConfig = prevConfigs[existingConfigIndex];
        const newConfigs = [...prevConfigs];
        if (existingConfig.direction === 'descending') {
          newConfigs.splice(existingConfigIndex, 1);
          return newConfigs;
        } else {
          const newDirection =
            existingConfig.direction === 'ascending'
              ? 'descending'
              : 'ascending';
          newConfigs[existingConfigIndex] = { key, direction: newDirection };
          return newConfigs;
        }
      } else {
        return [...prevConfigs, { key, direction: 'ascending' }];
      }
    });
  };

  return (
    <table className='e-table'>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.field} onClick={() => requestSort(col.field)}>
              {col.headerName}
              {sortConfigs.find((config) => config.key === col.field)
                ?.direction === 'ascending'
                ? ' 🔼'
                : sortConfigs.find((config) => config.key === col.field)
                    ?.direction === 'descending'
                ? ' 🔽'
                : null}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedRows.map((row, i) => (
          <tr key={row.id} className={i % 2 ? 'row-even' : 'row-odd'}>
            {columns.map((col) => (
              <td key={col.field + row.id}>{row[col.field]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
