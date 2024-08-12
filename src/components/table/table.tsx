'use client';

import { TableProps } from './table.types';
import './table.css';
import { useMemo, useState } from 'react';

export const Table: React.FC<TableProps> = ({
  columns,
  rows,
  rowsPerPageOptions = [5, 10, 20],
}: TableProps) => {
  const [sortConfigs, setSortConfigs] = useState<
    {
      key: string;
      direction: 'ascending' | 'descending';
    }[]
  >([]);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const onFilterChange = (columnKey: string, filterValue: string) => {
    setFilters({
      ...filters,
      [columnKey]: filterValue,
    });
    setCurrentPage(1); // Reset to the first page when filtering
  };

  const filteredData = rows.filter((row) => {
    return Object.keys(filters).every((key) =>
      row[key].toString().toLowerCase().includes(filters[key].toLowerCase())
    );
  });

  const sortedRows = useMemo(() => {
    let sortedData = [...filteredData];
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
  }, [filteredData, sortConfigs]);

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

  const totalPages = Math.ceil(sortedRows.length / rowsPerPage);

  const paginatedData = sortedRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div>
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
          <tr>
            {columns.map((column) => (
              <th
                key={`${column.field}-filter`}
                className='px-6 py-2 border-b-2 border-gray-300'
              >
                <input
                  type='text'
                  placeholder={`Filter ${column.headerName}`}
                  value={filters[column.field] || ''}
                  onChange={(e) => onFilterChange(column.field, e.target.value)}
                  className='p-2 border rounded w-full text-slate-950'
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, i) => (
            <tr key={row.id} className={i % 2 ? 'row-even' : 'row-odd'}>
              {columns.map((col) => (
                <td key={col.field + row.id}>{row[col.field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex justify-between items-center mt-4'>
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className='bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50'
        >
          Previous
        </button>
        <select
          onChange={(event) => {
            setRowsPerPage(parseInt(event.target.value));
          }}
          className='bg-slate-500 rounded py-2 px-4 cursor-pointer'
        >
          {rowsPerPageOptions.map((rowsPerPageOption) => (
            <option key={rowsPerPageOption} value={rowsPerPageOption}>
              {rowsPerPageOption}
            </option>
          ))}
        </select>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className='bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50'
        >
          Next
        </button>
      </div>
    </div>
  );
};
